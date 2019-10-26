import { VirtualDOM, setAttribute } from '@core/vdom';
import { ComponentFactory, createComponent, $$renderHook } from '@core/component';
import { isArray } from '@helpers';
import { getAppUid, getRegistery } from '@core/scope';
import { ATTR_SKIP } from '../constants';

type GetComponentFactoryType = (props: {}) => ComponentFactory;
type ShouldUpdate = (props, nextProps) => boolean;

const $$memo = Symbol('memo');
const isMemo = (o) => o && o.elementToken === $$memo;

const defaultShouldUpdate = (props: {}, nextProps: {}): boolean => {
  const keys = Object.keys(nextProps);

  for (const key of keys) {
    if (nextProps[key] !== props[key]) return true;
  }

  return false;
} 

function memo(getComponentFactory: GetComponentFactoryType, shouldUpdate: ShouldUpdate = defaultShouldUpdate) {
  const Memo = createComponent((props: {}) => {
    const uid = getAppUid();
    const app = getRegistery().get(uid);
    const renderHook = (mountedVNode: VirtualDOM) => {
      const vDOM = isArray(mountedVNode) ? mountedVNode : [mountedVNode];
      const componentRoute = vDOM[0].componentRoute;
      const componentId = componentRoute.join('.');
      let needUpdate = true;

      if (!app.memoStore[componentId]) {
        app.memoStore[componentId] = {
          props,
        };
      } else {
        needUpdate = shouldUpdate(app.memoStore[componentId].props, props);
        app.memoStore[componentId].props = props;
      }

      for (const vNode of vDOM) {
        setAttribute(vNode, ATTR_SKIP, !needUpdate);
      }
      
      return false;
    };

    props[$$renderHook] = renderHook;

    return getComponentFactory(props);
  }, { displayName: 'Memo', elementToken: $$memo });

  return Memo;
}

export { isMemo };
export default memo;
