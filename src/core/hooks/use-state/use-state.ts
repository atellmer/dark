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
} from '@core/scope';
import { mountVirtualDOM } from '@core/vdom/mount';
import { VirtualNode, replaceVirtualNode } from '@core/vdom/vnode';
import { isUndefined, flatten, getTime, isArray } from '@helpers';
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
    setAppUid(uid);
    setCurrentUseStateComponentId(componentId);
    const time = getTime();
    hooks.values[idx] = value;
    const vdom = getVirtualDOM(uid);
    const vNode = getComponentVirtualNodesById(componentId);
    const vNodeList = isArray(vNode) ? vNode : [vNode];
    const nodeRoute = vNodeList[0].nodeRoute;
    const nextVNodeList: Array<VirtualNode> = flatten([
      mountVirtualDOM({
        mountedSource: componentFactory,
        mountedComponentRoute: componentRoute.slice(0, -1),
        mountedNodeRoute: nodeRoute,
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
