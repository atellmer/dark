import { ComponentFactory, createComponent } from '@core/component';
import {
  getAppUid,
  getCurrentUseStateComponentId,
  getRegistery,
  setCurrentUseStateComponentId,
} from '@core/scope';
import { setAttribute, VirtualDOM } from '@core/vdom';
import { $$replaceNodeBeforeMountHook, $$skipNodeMountHook } from '@core/vdom/mount';
import { isArray } from '@helpers';
import { ATTR_SKIP } from '../constants';
import { patchNodeIds } from '../vdom/vnode';

type Component<T extends object> = (props?: T) => ComponentFactory;
type ShouldUpdate<T> = (props: T, nextProps: T) => boolean;

const $$memo = Symbol('memo');
const getIsMemo = (o) => o && o.elementToken === $$memo;

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
    const app = getRegistery().get(getAppUid());
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
      vNode: VirtualDOM,
      componentId: string, nodeId: string, skipMount: boolean, isDifferentNodeIds: boolean): VirtualDOM => {
      const vDOM = isArray(vNode) ? vNode : [vNode];

      if (!app.memoStore[componentId]) {
        app.memoStore[componentId] = { props };
      } else {
        if (skipMount) {
          isDifferentNodeIds && patchNodeIds(vNode, nodeId, true);

          for (const vNode of vDOM) {
            setAttribute(vNode, ATTR_SKIP, true);
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

export { getIsMemo };
export default memo;
