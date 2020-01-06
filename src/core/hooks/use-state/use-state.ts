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
  getComponentVirtualNodesById,
  getComponentPropsById,
  setComponentNodeRoutesById,
  getComponentNodeRoutesById,
} from '@core/scope';
import { mountVirtualDOM } from '@core/vdom/mount';
import {
  VirtualNode,
  getVirtualNodeByRoute,
  createRoot, patchNodeRoutes, getLastRouteId, replaceVirtualNode } from '@core/vdom/vnode';
import { isUndefined, flatten, isFunction, deepClone, truncateComponentId } from '@helpers';
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
    const props = getComponentPropsById(componentId);
    const nodeRoute = nodeRoutes[0];
    const parentNodeRoute = nodeRoute.slice(0, -1);
    const hasNode = Boolean(getVirtualNodeByRoute(vdom, nodeRoute));

    if (!hasNode) return; // remove after add unmount functional

    componentFactory.props = props;

    const parentVNode = getVirtualNodeByRoute(vdom, parentNodeRoute);
    const nextParentVNode = { ...parentVNode, children: [...parentVNode.children] };

    console.log('nextParentVNode', nextParentVNode);
    

    const nextVNodeList: Array<VirtualNode> = flatten([
      mountVirtualDOM({
        mountedSource: componentFactory,
        mountedComponentRoute: componentRoute.slice(0, -1),
        mountedNodeRoute: nodeRoute,
      }),
    ]);

    const lastIdx = getLastRouteId(nodeRoute);
    const newLastIdx = lastIdx + nextVNodeList.length;
    const diffCount = nodeRoutes.length - nextVNodeList.length;
    const diffCountAbs = Math.abs(diffCount);
    const isInsertOperation = diffCount < 0;
    const isRemoveOperation = diffCount > 0;
    const isUpdateOperation = diffCount === 0;

    if (isInsertOperation) {
      nextParentVNode.children.splice(lastIdx, nextVNodeList.length - diffCountAbs, ...nextVNodeList);
    } else if (isRemoveOperation) {
      nextParentVNode.children.splice(lastIdx, nextVNodeList.length, ...nextVNodeList);
      nextParentVNode.children.splice(newLastIdx, diffCount);
    } else {
      nextParentVNode.children.splice(lastIdx, nextVNodeList.length, ...nextVNodeList);
    }

    if (!isUpdateOperation) {
      const patchIdx = nextVNodeList[nextVNodeList.length - 1].nodeRoute.length - 1;
      const patchRouteId = getLastRouteId(nextVNodeList[nextVNodeList.length - 1].nodeRoute) + 1;
      let shift = 0;

      for (let i = newLastIdx; i < nextParentVNode.children.length; i++) {
        const vNode = nextParentVNode.children[i];
        patchNodeRoutes(vNode, patchIdx, patchRouteId + shift, true);
        shift++;
      }

      const nodeRoutesMap = nextParentVNode.children.reduce((acc, vNode) => {
        let componentId = vNode.componentRoute[vNode.componentRoute.length - 1] === -1
          ? vNode.componentRoute.join('.')
          : vNode.componentRoute[vNode.componentRoute.length - 2] === -1
            ? vNode.componentRoute.slice(0, -1).join('.')
            : '';

        if (!componentId) return;

        componentId = truncateComponentId(componentId);

        if (!acc[componentId]) {
          acc[componentId] = [];
        }

        acc[componentId].push(vNode.nodeRoute);

        return acc;
      }, {});

      const parentComponentId = truncateComponentId(nextParentVNode.componentRoute.join('.'));

      nodeRoutesMap[parentComponentId] = flatten(
        Object.keys(nodeRoutesMap).map(componentId => nodeRoutesMap[componentId]),
      );

      // console.log('nodeRoutesMap', nodeRoutesMap)

      for (const componentId of Object.keys(nodeRoutesMap)) {
        setComponentNodeRoutesById(componentId, nodeRoutesMap[componentId]);
      }

      // console.log('nextParentVNode', deepClone(nextParentVNode))
      // console.log('nodeRoutesMap', nodeRoutesMap)
    }

    processDOM({
      vNode: parentVNode,
      nextVNode: nextParentVNode,
      container: app.nativeElement as any,
    });

    if (nextParentVNode.nodeRoute.length === 1) {
      app.vdom = nextParentVNode;
    } else {
      replaceVirtualNode(nextParentVNode, vdom);
    }

    // console.log('vdom after:', deepClone(app.vdom));
  };

  if (isUndefined(hooks.values[idx])) {
    hooks.values[idx] = initialValue;
  }

  const value = hooks.values[idx];

  hooks.idx++;

  return [value, setState];
}

export default useState;
