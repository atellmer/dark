import { StatelessComponentFactory } from '@core/component';
import { createApp, getAppUid, getRegistery, getVirtualDOM, setAppUid } from '@core/scope';
import { mountVirtualDOM, VirtualNode } from '@core/vdom';
import { isUndefined } from '../../../helpers';
import { mountRealDOM, processDOM } from '../dom/dom';

const zoneIdByRootNodeMap = new WeakMap();
let renderInProcess = false;
let isInternalRenderCall = false;
let zoneCount = 0;

function renderComponent(source: VirtualNode | StatelessComponentFactory, container: HTMLElement, onRender?: Function) {
  const isMounted = !isUndefined(zoneIdByRootNodeMap.get(container));
  const prevZoneId = getAppUid();
  let zoneId = 0;

  if (!renderInProcess) {
    renderInProcess = true;
  } else {
    isInternalRenderCall = true;
  }

  if (!isMounted) {
    zoneIdByRootNodeMap.set(container, zoneCount);
    zoneCount++;
  }

  zoneId = zoneIdByRootNodeMap.get(container);

  setAppUid(zoneId);

  if (!isMounted) {
    let vNode: VirtualNode = null;
    const registry = getRegistery();
    const app = createApp(container);

    container.innerHTML = '';
    registry.set(zoneId, app);

    vNode = mountVirtualDOM({ element: source, fromRoot: true }) as VirtualNode;
    // console.log('vNode: ', vNode);
    app.vdom = vNode;
    const nodes = Array.from(mountRealDOM(vNode, app.nativeElement).childNodes);
    for (const node of nodes) {
      container.appendChild(node);
    }
  } else {
    const vNode = getVirtualDOM(zoneId);
    const nextVNode: VirtualNode = mountVirtualDOM({ element: source, fromRoot: true }) as VirtualNode;
    processDOM({ vNode, nextVNode });
  }

  if (!isInternalRenderCall) {
    renderInProcess = false;
  } else {
    isInternalRenderCall = false;
    setAppUid(prevZoneId);
  }

  typeof onRender === 'function' && onRender();
}

export {
  renderComponent, //
};
