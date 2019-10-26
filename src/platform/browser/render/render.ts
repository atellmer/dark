import { createApp, getAppUid, getRegistery, getVirtualDOM, setAppUid } from '@core/scope';
import { mountVirtualDOM, VirtualNode, MountedSource } from '@core/vdom';
import { isUndefined, getTime, isFunction } from '../../../helpers';
import { mountRealDOM, processDOM } from '../dom/dom';

const zoneIdByRootNodeMap = new WeakMap();
let renderInProcess = false;
let isInternalRenderCall = false;
let zoneCount = 0;

function renderComponent(source: MountedSource, container: HTMLElement, onRender?: Function) {
  const time = getTime();
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
  const registry = getRegistery();

  if (!isMounted) {
    let vNode: VirtualNode = null;
    const app = createApp(container);

    container.innerHTML = '';
    registry.set(zoneId, app);

    vNode = mountVirtualDOM({ mountedSource: source, fromRoot: true }) as VirtualNode;
    // console.log('vNode: ', vNode);
    app.vdom = vNode;
    const nodes = Array.from(mountRealDOM(vNode, app.nativeElement as HTMLElement).childNodes);
    for (const node of nodes) {
      container.appendChild(node);
    }
  } else {
    const app = registry.get(zoneId)
    const vNode = getVirtualDOM(zoneId);
    const nextVNode: VirtualNode = mountVirtualDOM({ mountedSource: source, fromRoot: true }) as VirtualNode;

    processDOM({ vNode, nextVNode });

    const portalsKeys = Object.keys(app.portals);
    for(const key of portalsKeys) {
      if (time > app.portals[key].time) {
        app.portals[key].unmountContainer();
        delete app.portals[key];
      }
    }
  }

  if (!isInternalRenderCall) {
    renderInProcess = false;
  } else {
    isInternalRenderCall = false;
    setAppUid(prevZoneId);
  }

  isFunction(onRender) && onRender();
}

export {
  renderComponent, //
};
