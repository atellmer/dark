import {
  getRegistery,
  getHooks,
  getMountedComponentFactory,
  getMountedComponentId,
  getVirtualDOM,
  getAppUid,
  setAppUid,
  setCurrentUseStateComponentId,
  getComponentPropsById,
  AppType,
  getComponentVirtualNodesById,
  setComponentVirtualNodesById,
} from '@core/scope';
import { mountVirtualDOM } from '@core/vdom/mount';
import {
  VirtualNode,
  getVirtualNodeByRoute,
  createRoot,
  getLastRouteId,
  replaceVirtualNode,
  createNodeRouteFromId,
  getCompletedNodeIdFromEnd,
  getLastRouteIdFromNodeId,
  getParentNodeId,
  getLastRouteIdFromComponentId,
  getParentComponentId,
  patchNodeIds,
} from '@core/vdom/vnode';
import { isUndefined, flatten, isFunction, deepClone, truncateComponentId } from '@helpers';
import { processDOM } from '../../../platform/browser/dom'; // temp

type SetStateValue<T> = T | ((prevValue: T) => T)

function useState<T = any>(initialValue: T): [T, (v: SetStateValue<T>) => void] {
  const uid = getAppUid();
  const app = getRegistery().get(uid);
  const componentId = getMountedComponentId();
  const hooks = getHooks(componentId);
  const componentFactory = getMountedComponentFactory();
  const idx = hooks.idx;
  const setState = (value: SetStateValue<T>) => {
    setAppUid(uid);
    setCurrentUseStateComponentId(componentId);
    hooks.values[idx] = isFunction(value) ? value(hooks.values[idx]) : value;
    const vdom = getVirtualDOM(uid);
    const vNodes = getComponentVirtualNodesById(componentId);
    const nodeIds = vNodes.map(vNode => vNode.nodeId);
    const nodeId = nodeIds[0];
    const hasNode = checkVNode(componentId, vdom, nodeId);

    if (!hasNode) return; // remove after add unmount functional

    componentFactory.props = getComponentPropsById(componentId);

    const nextVNodeList: Array<VirtualNode> = flatten([
      mountVirtualDOM({
        mountedSource: componentFactory,
        mountedComponentId: getParentComponentId(componentId),
        mountedNodeId: nodeId,
      }),
    ]);

    const { rootVNode, nextRootVNode } = getRootNodes({ nodeIds, nextVNodeList, app });

    processDOM({
      vNode: rootVNode,
      nextVNode: nextRootVNode,
      container: app.nativeElement as any,
    });

   // console.log('vdom after:', deepClone(app.vdom));
  };

  if (isUndefined(hooks.values[idx])) {
    hooks.values[idx] = initialValue;
  }

  const value = hooks.values[idx];

  hooks.idx++;

  return [value, setState];
}

function checkVNode(componentId: string, vdom: VirtualNode, nodeId: string): boolean {
  const nodeRoute = createNodeRouteFromId(nodeId);
  const vNode = getVirtualNodeByRoute(vdom, nodeRoute);
  const comparedComponentId = vNode ? vNode.componentId : '';
  const hasNode = Boolean(vNode)
      ? componentId.length === comparedComponentId.length
        ? componentId === comparedComponentId
        : true
      : false;

  return hasNode;
}

function generateVirtualNodesMap(parentVNode: VirtualNode): Record<string, Array<VirtualNode>> {
  const reduceFn = (acc: Record<string, Array<VirtualNode>>, vNode: VirtualNode) => {
    const parentComponentId = getParentComponentId(vNode.componentId);
    let componentId = getLastRouteIdFromComponentId(vNode.componentId) === -1
      ? vNode.componentId
      : getLastRouteIdFromComponentId(parentComponentId) === -1
        ? parentComponentId
        : '';

    if (!componentId) return;

    componentId = truncateComponentId(componentId);

    if (!acc[componentId]) {
      acc[componentId] = [];
    }

    acc[componentId].push(vNode);

    return acc;
  };
  const vNodesMap = parentVNode.children.reduce(reduceFn, {});
  const parentComponentId = truncateComponentId(parentVNode.componentId);

  vNodesMap[parentComponentId] = flatten(
    Object.keys(vNodesMap).map(componentId => vNodesMap[componentId]),
  );

  return vNodesMap;
}

type GetRootNodesOptions = {
  nodeIds: Array<string>;
  nextVNodeList: Array<VirtualNode>;
  app: AppType;
}

function getRootNodes(options: GetRootNodesOptions) {
  const {
    nodeIds,
    nextVNodeList,
    app,
  } = options;
  let rootVNode: VirtualNode = null;
  let nextRootVNode: VirtualNode = null;
  const { vdom } = app;
  const nodeRoute = createNodeRouteFromId(nodeIds[0]);
  const parentNodeRoute = nodeRoute.slice(0, -1);
  const lastIdx = getLastRouteId(nodeRoute);
  const newLastIdx = lastIdx + nextVNodeList.length;
  const diffCount = nodeIds.length - nextVNodeList.length;
  const diffCountAbs = Math.abs(diffCount);
  const isInsertOperation = diffCount < 0;
  const isRemoveOperation = diffCount > 0;
  const isUpdateOperation = diffCount === 0;
  const parentVNode = getVirtualNodeByRoute(vdom, parentNodeRoute);
  const nextParentVNode = !isUpdateOperation
    ? { ...parentVNode, children: [...parentVNode.children] }
    : parentVNode;

  if (isInsertOperation) {
    nextParentVNode.children.splice(lastIdx, nextVNodeList.length - diffCountAbs, ...nextVNodeList);
  } else if (isRemoveOperation) {
    nextParentVNode.children.splice(lastIdx, nextVNodeList.length, ...nextVNodeList);
    nextParentVNode.children.splice(newLastIdx, diffCount);
  }

  if (isUpdateOperation) {
    const vNodeList = parentVNode.children.slice(lastIdx, newLastIdx);
    rootVNode = createRoot(parentVNode.componentId, parentVNode.nodeId, vNodeList);
    nextRootVNode = createRoot(nextParentVNode.componentId, parentVNode.nodeId, nextVNodeList);

    for (const vNode of nextVNodeList) {
      replaceVirtualNode(vNode, vdom);
    }
  } else {
    const patchRouteId = getLastRouteIdFromNodeId(nextVNodeList[nextVNodeList.length - 1].nodeId) + 1;
    let shift = 0;

    for (let i = newLastIdx; i < nextParentVNode.children.length; i++) {
      const vNode = nextParentVNode.children[i];

      vNode.nodeId = getCompletedNodeIdFromEnd(getParentNodeId(vNode.nodeId), patchRouteId + shift);
      patchNodeIds(vNode, vNode.nodeId, true);
      shift++;
    }

    const vNodesMap = generateVirtualNodesMap(nextParentVNode);
    const componentIds = Object.keys(vNodesMap);

    for (const componentId of componentIds) {
      setComponentVirtualNodesById(componentId, vNodesMap[componentId], true);
    }

    if (nextParentVNode.nodeId.length === 1) {
      app.vdom = nextParentVNode;
    } else {
      replaceVirtualNode(nextParentVNode, vdom);
    }

    rootVNode = parentVNode;
    nextRootVNode = nextParentVNode;
  }

  return {
    rootVNode,
    nextRootVNode,
  };
}

export default useState;
