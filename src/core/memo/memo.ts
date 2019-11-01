import { VirtualDOM, setAttribute } from '@core/vdom';
import { $$skipNodeMountHook, $$replaceNodeBeforeMountHook } from '@core/vdom/mount';
import { ComponentFactory, createComponent } from '@core/component';
import { isArray } from '@helpers';
import { getAppUid, getRegistery } from '@core/scope';
import { ATTR_SKIP } from '../constants';

type GetComponentFactoryType = (props: {}) => ComponentFactory;
type ShouldUpdate<T> = (props: T, nextProps: T) => boolean;

const $$memo = Symbol('memo');
const isMemo = (o) => o && o.elementToken === $$memo;

const defaultShouldUpdate = (props: {}, nextProps: {}): boolean => {
  const keys = Object.keys(nextProps);

  for (const key of keys) {
    if (nextProps[key] !== props[key]) return true;
  }

  return false;
} 

function memo<T = any>(getComponentFactory: GetComponentFactoryType, shouldUpdate: ShouldUpdate<T> = defaultShouldUpdate) {
  const Memo = createComponent((props: {}) => {
    const uid = getAppUid();
    const app = getRegistery().get(uid);
    const skipMountHook = (componentId: string): boolean => {
      if (Boolean(app.memoStore[componentId])) {
        const memoStoreItem = app.memoStore[componentId];
        const needUpdate = shouldUpdate(memoStoreItem.props, props as T);

        return !needUpdate;
      }

      return false;
    };
    const replaceNodeBeforeMountHook = (
      mountedVNode: VirtualDOM, componentId: string, nodeRoute: Array<number>, skipMount: boolean): VirtualDOM => {
      const vDOM = isArray(mountedVNode) ? mountedVNode : [mountedVNode];
      let vNode: VirtualDOM = mountedVNode;

      if (!app.memoStore[componentId]) {
        app.memoStore[componentId] = {
          vNode: mountedVNode,
          props,
        };
      } else {
        vNode = mountedVNode;
        if (skipMount) {
          vNode = app.memoStore[componentId].vNode;
          const patchIdx = nodeRoute.length - 1;
          const patchRouteId = nodeRoute[patchIdx];

          patchNodeRoutes(vNode, patchIdx, patchRouteId);

          for (const vNode of vDOM) {
            setAttribute(vNode, ATTR_SKIP, true);
          }    
        }
        app.memoStore[componentId].vNode = vNode;
        app.memoStore[componentId].props = props;
      }

      return vNode;
    };

    props[$$skipNodeMountHook] = skipMountHook;
    props[$$replaceNodeBeforeMountHook] = replaceNodeBeforeMountHook;

    return getComponentFactory(props);
  }, { displayName: 'Memo', elementToken: $$memo });

  return Memo;
}

function patchNodeRoutes(vNode: VirtualDOM, idx: number, routeId: number) {
  const vDOM = isArray(vNode) ? vNode : [vNode];
  
  for (const vNode of vDOM) {
    vNode.nodeRoute[idx] = routeId;
    if (vNode.children.length > 0) {
      patchNodeRoutes(vNode.children, idx, routeId);
    }
  }
}

export { isMemo };
export default memo;
