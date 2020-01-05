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
} from '@core/scope';
import { mountVirtualDOM } from '@core/vdom/mount';
import {
  VirtualNode,
  getVirtualNodeByRoute,
  createRoot, patchNodeRoutes, getLastRouteId, replaceVirtualNode } from '@core/vdom/vnode';
import { isUndefined, flatten, isFunction, deepClone } from '@helpers';
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
    const vNodes = getComponentVirtualNodesById(componentId);
    const props = getComponentPropsById(componentId);
    const nodeRoute = vNodes[0].nodeRoute;
    const parentNodeRoute = nodeRoute.slice(0, -1);
    const hasNode = Boolean(getVirtualNodeByRoute(vdom, nodeRoute));

    if (!hasNode) return; // remove after add unmount functional

    componentFactory.props = props;

    const nextVNodeList: Array<VirtualNode> = flatten([
      mountVirtualDOM({
        mountedSource: componentFactory,
        mountedComponentRoute: componentRoute.slice(0, -1),
        mountedNodeRoute: nodeRoute,
      }),
    ]);

    const rootVNode = createRoot(componentRoute, parentNodeRoute, vNodes);
    const rootNextVNode = createRoot(componentRoute, parentNodeRoute, nextVNodeList);
    const parentVNode = getVirtualNodeByRoute(vdom, parentNodeRoute);
    const lastIdx = getLastRouteId(vNodes[0].nodeRoute);
    const newLastIdx = lastIdx + nextVNodeList.length;
    const diffCount = vNodes.length - nextVNodeList.length;
    const diffCountAbs = Math.abs(diffCount);
    const isInsertOperation = diffCount < 0;
    const isRemoveOperation = diffCount > 0;
    const isUpdateOperation = diffCount === 0;

    processDOM({
      vNode: rootVNode,
      nextVNode: rootNextVNode,
      container: app.nativeElement as any,
    });

    if (isInsertOperation) {
      parentVNode.children.splice(lastIdx, nextVNodeList.length - diffCountAbs, ...nextVNodeList);
    } else if (isRemoveOperation) {
      parentVNode.children.splice(lastIdx, nextVNodeList.length, ...nextVNodeList);
      parentVNode.children.splice(newLastIdx, diffCount);
    } else {
      for (const nextVNode of nextVNodeList) {
        replaceVirtualNode(nextVNode, vdom);
      }
    }

    if (!isUpdateOperation) {
      const patchIdx = nextVNodeList[nextVNodeList.length - 1].nodeRoute.length - 1;
      const patchRouteId = getLastRouteId(nextVNodeList[nextVNodeList.length - 1].nodeRoute) + 1;
      let shift = 0;

      for (let i = newLastIdx; i < parentVNode.children.length; i++) {
        const vNode = parentVNode.children[i];
        patchNodeRoutes(vNode, patchIdx, patchRouteId + shift, true);
        shift++;
      }
    }

    const nodeRoutes = nextVNodeList.map(x => x.nodeRoute);

    setComponentNodeRoutesById(componentId, nodeRoutes);
    // console.log('vdom after:', deepClone(vdom));
  };

  if (isUndefined(hooks.values[idx])) {
    hooks.values[idx] = initialValue;
  }

  const value = hooks.values[idx];

  hooks.idx++;

  return [value, setState];
}

export default useState;
