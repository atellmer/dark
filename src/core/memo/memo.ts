import { VirtualDOM, setAttribute } from '@core/vdom';
import { $$skipNodeMountHook, $$replaceNodeBeforeMountHook } from '@core/vdom/mount';
import { ComponentFactory, createComponent } from '@core/component';
import { isArray, isEmpty } from '@helpers';
import {
  getAppUid,
  getRegistery,
  getCurrentUseStateComponentId,
  setCurrentUseStateComponentId,
  getVirtualDOM,
} from '@core/scope';
import { ATTR_SKIP } from '../constants';
import { getVirtualNodeByRoute, getNodeKey } from '../vdom/vnode';
import { patchTimeOfPortals } from '../../platform/browser/portal';

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
  const Memo = createComponent((props: T & { key?: any }) => {
    const uid = getAppUid();
    const app = getRegistery().get(uid);
    const skipMountHook = (componentId: string): boolean => {
      if (Boolean(app.memoStore[componentId])) {
        const memoStoreItem = app.memoStore[componentId];
        const currentUseStateComponentId = getCurrentUseStateComponentId();
        const fromUseState = currentUseStateComponentId === componentId;
        let needUpdate = fromUseState || shouldUpdate(memoStoreItem.props, props as T);

        setCurrentUseStateComponentId('');

        return !needUpdate;
      }

      return false;
    };
    const replaceNodeBeforeMountHook = (
      vNode: VirtualDOM, componentId: string, nodeRoute: Array<number>, skipMount: boolean): VirtualDOM => {
      const vDOM = isArray(vNode) ? vNode : [vNode];

      if (!app.memoStore[componentId]) {
        app.memoStore[componentId] = { props };
      } else {
        if (skipMount) {
          const patchIdx = nodeRoute.length - 1;
          const patchRouteId = nodeRoute[patchIdx];
          let skipReconciliation = true;

          patchNodeRoutes(vNode, patchIdx, patchRouteId);
          patchTimeOfPortals(uid, componentId);

          if (!isEmpty(props.key)) {
            const vdom = getVirtualDOM(uid);
            const prevVNode = getVirtualNodeByRoute(vdom, nodeRoute)
            const prevKey = getNodeKey(prevVNode);

            skipReconciliation = props.key === prevKey;
          }

          for (const vNode of vDOM) {
            setAttribute(vNode, ATTR_SKIP, skipReconciliation);
          }    
        }
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
