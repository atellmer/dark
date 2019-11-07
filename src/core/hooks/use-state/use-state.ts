import {
  getRegistery,
  getHooks,
	getMountedComponentRoute,
	getMountedNodeRoute,
  getMountedComponentFactory,
  getMountedComponentId,
	getVirtualDOM,
  getAppUid,
} from '@core/scope';
import { mountVirtualDOM } from '@core/vdom/mount';
import { getVirtualNodesByComponentId, VirtualNode, replaceVirtualNode } from '@core/vdom/vnode';
import { isUndefined, flatten } from '@helpers';
import  { processDOM } from '../../../platform/browser/dom'; //temp


function useState<T = any>(initialValue: T): [T, (v: T) => void] {
  const uid = getAppUid();
  const app = getRegistery().get(uid);
  const componentId = getMountedComponentId();
  const componentRoute = getMountedComponentRoute();  
  const nodeRoute = getMountedNodeRoute();
  const hooks = getHooks(componentId);
  const componentFactory = getMountedComponentFactory();
  const idx = hooks.idx;

	const setState = (value: T) => {
    hooks.values[idx] = value;
    const vdom = getVirtualDOM(uid);
    const vNodeList: Array<VirtualNode> = getVirtualNodesByComponentId(componentId, vdom);
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
	};

	if (isUndefined(hooks.values[idx])) {
		hooks.values[idx] = initialValue;
  }
  
  const value = hooks.values[idx];

  hooks.idx++;

	return [value, setState];
}

export default useState;
