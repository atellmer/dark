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
  setComponentVirtualNodesById,
} from '@core/scope';
import { mountVirtualDOM } from '@core/vdom/mount';
import { VirtualNode, getVirtualNodeByRoute, createRoot, patchNodeRoutes, getLastRouteId } from '@core/vdom/vnode';
import { isUndefined, flatten, isArray, isFunction, deepClone } from '@helpers';
import { processDOM } from '../../../platform/browser/dom'; //temp

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
    const vNode = getComponentVirtualNodesById(componentId);
    const props = getComponentPropsById(componentId);
    const vNodeList = isArray(vNode) ? vNode : [vNode];
    const nodeRoute = vNodeList[0].nodeRoute;
    const parentNodeRoute = nodeRoute.slice(0, -1);

    componentFactory.props = props;

    const nextVNodeList: Array<VirtualNode> = flatten([
      mountVirtualDOM({
        mountedSource: componentFactory,
        mountedComponentRoute: componentRoute.slice(0, -1),
        mountedNodeRoute: nodeRoute,
      }),
    ]);

    const rootVNode = createRoot(componentRoute, parentNodeRoute, vNodeList);
    const rootNextVNode = createRoot(componentRoute, parentNodeRoute, nextVNodeList);
    const parentVNode = getVirtualNodeByRoute(vdom, parentNodeRoute);
    const lastIdx = getLastRouteId(vNodeList[0].nodeRoute);
    const newLastIdx = lastIdx + nextVNodeList.length;
    const diffCount = vNodeList.length - nextVNodeList.length;
    const isUpdateOperation = diffCount === 0;
    const isInsertOperation = diffCount < 0;
    const isRemoveOperation = diffCount > 0;
    const forceInsert = isInsertOperation && (lastIdx + Math.abs(diffCount) < parentVNode.children.length);

    processDOM({
      vNode: rootVNode,
      nextVNode: rootNextVNode,
      container: app.nativeElement as any,
      forceInsert,
    });

    if (isInsertOperation) {
      parentVNode.children.splice(lastIdx, nextVNodeList.length - Math.abs(diffCount), ...nextVNodeList);
    } else if (isRemoveOperation) {
      parentVNode.children.splice(lastIdx, nextVNodeList.length, ...nextVNodeList);
      parentVNode.children.splice(newLastIdx, diffCount);
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

    setComponentVirtualNodesById(componentId, nextVNodeList.length === 1 ? nextVNodeList[0] : nextVNodeList);
    // console.log('vdom after:', vdom);
  };

  if (isUndefined(hooks.values[idx])) {
    hooks.values[idx] = initialValue;
  }

  const value = hooks.values[idx];

  hooks.idx++;

  return [value, setState];
}

export default useState;
