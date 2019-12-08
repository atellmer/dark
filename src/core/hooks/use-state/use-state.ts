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
import { VirtualNode, replaceVirtualNode } from '@core/vdom/vnode';
import { isUndefined, flatten, getTime, isArray, isFunction } from '@helpers';
import { processDOM } from '../../../platform/browser/dom'; //temp
import { clearUnmountedPortalContainers } from '../../../platform/browser/portal'; //temp

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
    const time = getTime();
    hooks.values[idx] = isFunction(value) ? value(hooks.values[idx]) : value;
    const vdom = getVirtualDOM(uid);
    const vNode = getComponentVirtualNodesById(componentId);
    const props = getComponentPropsById(componentId);
    const vNodeList = isArray(vNode) ? vNode : [vNode];
    const nodeRoute = vNodeList[0].nodeRoute;

    componentFactory.props = props;

    const nextVNodeList: Array<VirtualNode> = flatten([
      mountVirtualDOM({
        mountedSource: componentFactory,
        mountedComponentRoute: componentRoute.slice(0, -1),
        mountedNodeRoute: nodeRoute,
      }),
    ]);

    const iterations = Math.max(vNodeList.length, nextVNodeList.length);

    for (let i = 0; i < iterations; i++) {
      const vNode = vNodeList[i];
      const nextVNode = nextVNodeList[i];
      processDOM({
        vNode,
        nextVNode,
        container: app.nativeElement as any,
      });

      replaceVirtualNode(nextVNode, vdom);
    }

    setComponentVirtualNodesById(componentId, nextVNodeList.length === 1 ? nextVNodeList[0] : nextVNodeList);
    clearUnmountedPortalContainers(uid, time, componentId);
    app.vdom = vdom;
  };

  if (isUndefined(hooks.values[idx])) {
    hooks.values[idx] = initialValue;
  }

  const value = hooks.values[idx];

  hooks.idx++;

  return [value, setState];
}

export default useState;
