import { VirtualDOM, createVirtualNode } from '@core/vdom';
import { StatelessComponentFactory, createComponent, $$renderHook, $$nodeRouteHook } from '@core/component';
import { mountRealDOM, processDOM } from '../dom/dom';
import { isArray, getTime } from '@helpers';
import { getAppUid, getRegistery } from '@core/scope';

type Source = VirtualDOM | StatelessComponentFactory;

const $$portal = Symbol('portal');
const Portal = createComponent(({ slot }) => slot || null, { displayName: 'Portal', elementToken: $$portal });
const isPortal = (o) => o && o.elementToken === $$portal;

function createPortal(source: Source, container: HTMLElement) {
  const nodeRouteHook = () => [0, 0];
  const renderHook = (mountedVNode: VirtualDOM) => {
    const time = getTime();
    const uid = getAppUid();
    const app = getRegistery().get(uid);
    const vDOM = isArray(mountedVNode) ? mountedVNode : [mountedVNode];
    const componentRoute = vDOM[0].componentRoute.slice(0, -1);
    const componentId = componentRoute.join('.');
    let portal = null;

    if (!app.portals[componentId]) {
      app.portals[componentId] = {
        vNode: null,
        time,
        unmountContainer: () => container && container instanceof HTMLElement && (container.innerHTML = ''),
      };
    }

    portal = app.portals[componentId];

    const vNode = portal.vNode;
    const nextVNode = createVirtualNode('TAG', {
      name: 'root',
      componentRoute,
      nodeRoute: [0],
      children: isArray(vDOM) ? vDOM : [vDOM],
    });

    if (!vNode) {
      container.innerHTML = '';
      const nodes = Array.from(mountRealDOM(nextVNode, container).childNodes);

      for (const node of nodes) {
        container.appendChild(node);
      }
      portal.vNode = nextVNode;
    } else {
      processDOM({ vNode, nextVNode, container });
      portal.time = time;
      portal.vNode = nextVNode;
    }

    return true;
  };

  return Portal({
    slot: source,
    [$$nodeRouteHook]: nodeRouteHook,
    [$$renderHook]: renderHook,
  });
}

export {
  isPortal,
  createPortal,
}