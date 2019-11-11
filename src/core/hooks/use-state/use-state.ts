import {
  getRegistery,
  getHooks,
	getMountedComponentRoute,
  getMountedComponentFactory,
  getMountedComponentId,
	getVirtualDOM,
  getAppUid,
  setFromUseStateRender,
} from '@core/scope';
import { mountVirtualDOM } from '@core/vdom/mount';
import { getVirtualNodesByComponentId, VirtualNode, replaceVirtualNode } from '@core/vdom/vnode';
import { isUndefined, flatten, getTime } from '@helpers';
import  { processDOM } from '../../../platform/browser/dom'; //temp
import { clearUnmountedPortalContainers } from '../../../platform/browser/portal'; //temp


function useState<T = any>(initialValue: T): [T, (v: T) => void] {
  const uid = getAppUid();
  const app = getRegistery().get(uid);
  const componentId = getMountedComponentId();
  const componentRoute = getMountedComponentRoute();
  const hooks = getHooks(componentId);
  const componentFactory = getMountedComponentFactory();
  const idx = hooks.idx;
	const setState = (value: T) => {
    setFromUseStateRender(true);
    const time = getTime();
    hooks.values[idx] = value;
    const vdom = getVirtualDOM(uid);
    const vNodeList: Array<VirtualNode> = getVirtualNodesByComponentId(componentId, vdom);
    const nodeRoute = vNodeList[0].nodeRoute;
    const fromRoot = nodeRoute.length === 1;
    const nextVNodeList: Array<VirtualNode> = flatten([
      mountVirtualDOM({
        mountedSource: componentFactory,
        mountedComponentRoute: componentRoute.slice(0, -1),
        mountedNodeRoute: nodeRoute,
        fromRoot,
      })
    ]);  
    const iterations = Math.max(vNodeList.length, nextVNodeList.length);

    for(let i = 0; i < iterations; i++) {
      processDOM({
        vNode: vNodeList[i],
        nextVNode: nextVNodeList[i],
        container: app.nativeElement as any,
      });

      replaceVirtualNode(nextVNodeList[i], vdom);
    }

    clearUnmountedPortalContainers(uid, time, componentId);
	};

	if (isUndefined(hooks.values[idx])) {
		hooks.values[idx] = initialValue;
  }
  
  const value = hooks.values[idx];

  hooks.idx++;

	return [value, setState];
}

export default useState;
