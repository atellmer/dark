import {
  getRegistery,
  getHooks,
  getMountedComponentRoute,
  getMountedComponentFactory,
  getMountedComponentId,
  getVirtualDOM,
  getAppUid,
  setAppUid,
  setCurrentUseStateComponentId,
  getComponentPropsById,
  setComponentNodeRoutesById,
  getComponentNodeRoutesById,
  AppType,
} from '@core/scope';
import { mountVirtualDOM } from '@core/vdom/mount';
import {
  VirtualNode,
  getVirtualNodeByRoute,
  createRoot,
  patchNodeRoutes,
  getLastRouteId,
  replaceVirtualNode,
} from '@core/vdom/vnode';
import { isUndefined, flatten, isFunction, deepClone, truncateComponentId, createComponentId } from '@helpers';
import { processDOM } from '../../../platform/browser/dom'; // temp

type SetStateValue<T> = T | ((prevValue: T) => T)

function useState<T = any>(initialValue: T): [T, (v: SetStateValue<T>) => void] {
  const uid = getAppUid();
  const app = getRegistery().get(uid);
  const componentId = getMountedComponentId();
  const componentRoute = [...getMountedComponentRoute()];
  const hooks = getHooks(componentId);
  const componentFactory = getMountedComponentFactory();
  const idx = hooks.idx;
  const setState = (value: SetStateValue<T>) => {
    setAppUid(uid);
    setCurrentUseStateComponentId(componentId);
    hooks.values[idx] = isFunction(value) ? value(hooks.values[idx]) : value;
    const vdom = getVirtualDOM(uid);
    const nodeRoutes = getComponentNodeRoutesById(componentId);
    const nodeRoute = nodeRoutes[0];
    const hasNode = checkVNode(componentId, vdom, nodeRoute);

    if (!hasNode) return; // remove after add unmount functional

    componentFactory.props = getComponentPropsById(componentId);

    const nextVNodeList: Array<VirtualNode> = flatten([
      mountVirtualDOM({
        mountedSource: componentFactory,
        mountedComponentRoute: componentRoute.slice(0, -1),
        mountedNodeRoute: nodeRoute,
      }),
    ]);
    const { rootVNode, nextRootVNode } = getRootNodes({ nodeRoutes, nextVNodeList, app });

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

function checkVNode(componentId: string, vdom: VirtualNode, nodeRoute: Array<number>): boolean {
  const vNode = getVirtualNodeByRoute(vdom, nodeRoute);
  const comparedComponentId = vNode ? createComponentId(vNode.componentRoute) : '';
  const hasNode = Boolean(vNode)
      ? componentId.length === comparedComponentId.length
        ? componentId === comparedComponentId
        : true
      : false;

  return hasNode;
}

function generateNodeRoutesMap(parentVNode: VirtualNode): Record<string, Array<Array<number>>> {
  const reduceFn = (acc: Record<string, Array<Array<number>>>, vNode: VirtualNode) => {
    let componentId = vNode.componentRoute[vNode.componentRoute.length - 1] === -1
      ? createComponentId(vNode.componentRoute)
      : vNode.componentRoute[vNode.componentRoute.length - 2] === -1
        ? createComponentId(vNode.componentRoute.slice(0, -1))
        : '';

    if (!componentId) return;

    componentId = truncateComponentId(componentId);

    if (!acc[componentId]) {
      acc[componentId] = [];
    }

    acc[componentId].push(vNode.nodeRoute);

    return acc;
  };
  const nodeRoutesMap = parentVNode.children.reduce(reduceFn, {});
  const parentComponentId = truncateComponentId(createComponentId(parentVNode.componentRoute));

  nodeRoutesMap[parentComponentId] = flatten(
    Object.keys(nodeRoutesMap).map(componentId => nodeRoutesMap[componentId]),
  );

  return nodeRoutesMap;
}

type GetRootNodesOptions = {
  nodeRoutes: Array<Array<number>>;
  nextVNodeList: Array<VirtualNode>;
  app: AppType;
}

function getRootNodes(options: GetRootNodesOptions) {
  const {
    nodeRoutes,
    nextVNodeList,
    app,
  } = options;
  let rootVNode: VirtualNode = null;
  let nextRootVNode: VirtualNode = null;
  const { vdom } = app;
  const nodeRoute = nodeRoutes[0];
  const parentNodeRoute = nodeRoute.slice(0, -1);
  const lastIdx = getLastRouteId(nodeRoute);
  const newLastIdx = lastIdx + nextVNodeList.length;
  const diffCount = nodeRoutes.length - nextVNodeList.length;
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
    rootVNode = createRoot(parentVNode.componentRoute, parentVNode.nodeRoute, vNodeList);
    nextRootVNode = createRoot(nextParentVNode.componentRoute, parentVNode.nodeRoute, nextVNodeList);

    for (const vNode of nextVNodeList) {
      replaceVirtualNode(vNode, vdom);
    }
  } else {
    const patchRouteId = getLastRouteId(nextVNodeList[nextVNodeList.length - 1].nodeRoute) + 1;
    let shift = 0;

    for (let i = newLastIdx; i < nextParentVNode.children.length; i++) {
      const vNode = nextParentVNode.children[i];
      const nodeRoute = [...vNode.nodeRoute];

      nodeRoute[nodeRoute.length - 1] = patchRouteId + shift;
      patchNodeRoutes(vNode, nodeRoute, true);
      shift++;
    }

    const nodeRoutesMap = generateNodeRoutesMap(nextParentVNode);
    const componentIds = Object.keys(nodeRoutesMap);

    for (const componentId of componentIds) {
      setComponentNodeRoutesById(componentId, nodeRoutesMap[componentId], true);
    }

    if (nextParentVNode.nodeRoute.length === 1) {
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
