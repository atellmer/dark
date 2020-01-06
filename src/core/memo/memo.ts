import { ComponentFactory, createComponent } from '@core/component';
import {
  getAppUid,
  getCurrentUseStateComponentId,
  getRegistery,
  getVirtualDOM,
  setCurrentUseStateComponentId,
} from '@core/scope';
import { setAttribute, VirtualDOM } from '@core/vdom';
import { $$replaceNodeBeforeMountHook, $$skipNodeMountHook } from '@core/vdom/mount';
import { isArray, isEmpty, deepClone } from '@helpers';
import { ATTR_SKIP } from '../constants';
import { getNodeKey, getVirtualNodeByRoute, patchNodeRoutes } from '../vdom/vnode';

type Component<T extends object> = (props?: T) => ComponentFactory;
type ShouldUpdate<T> = (props: T, nextProps: T) => boolean;

const $$memo = Symbol('memo');
const isMemo = (o) => o && o.elementToken === $$memo;

const defaultShouldUpdate = (props: {}, nextProps: {}): boolean => {
  const keys = Object.keys(nextProps);

  for (const key of keys) {
    if (nextProps[key] !== props[key] && key !== 'slot') {
      return true;
    }
  }

  return false;
}

function memo<T extends object>(
  component: Component<T>, shouldUpdate: ShouldUpdate<T> = defaultShouldUpdate): Component<T> {
  const Memo = createComponent((props?: T & { key?: any }) => {
    const uid = getAppUid();
    const app = getRegistery().get(uid);
    const skipMountHook = (componentId: string): boolean => {
      if (Boolean(app.memoStore[componentId])) {
        const memoStoreItem = app.memoStore[componentId];
        const currentUseStateComponentId = getCurrentUseStateComponentId();
        const fromUseState = currentUseStateComponentId === componentId;
        const needUpdate = fromUseState || shouldUpdate(memoStoreItem.props, props as T);

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

          patchNodeRoutes(vNode, patchIdx, patchRouteId, true);

          for (const vNode of vDOM) {
            let skipReconciliation = true;

            if (!isEmpty(props.key)) {
              const vdom = getVirtualDOM(uid);
              const prevVNode = getVirtualNodeByRoute(vdom, nodeRoute)
              const prevKey = getNodeKey(prevVNode);

              skipReconciliation = props.key === prevKey;
            }

            setAttribute(vNode, ATTR_SKIP, skipReconciliation);
          }
        }

        app.memoStore[componentId].props = props;
      }

      return vNode;
    };

    props[$$skipNodeMountHook] = skipMountHook;
    props[$$replaceNodeBeforeMountHook] = replaceNodeBeforeMountHook;

    return component(props);
  }, { displayName: 'Memo', elementToken: $$memo });

  return Memo;
}

export { isMemo };
export default memo;
