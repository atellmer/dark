import { StatelessComponentFactory } from '@core/component';
import { createApp, getAppUid, getRegistery, getVirtualDOM, setAppUid, setMountedRoute } from '@core/scope';
import {
  buildVirtualNodeWithRoutes,
  createVirtualEmptyNode,
  createVirtualNode,
  mountVirtualDOM,
  VirtualNode,
} from '@core/vdom';
import { isArray, isNull, isUndefined } from '../../../helpers';
import { mountDOM, processDOM } from '../dom/dom';

const zoneIdByRootNodeMap = new WeakMap();
let renderInProcess = false;
let isInternalRenderCall = false;
let zoneCount = 0;

function createRootVirtualNode(sourceVNode: VirtualNode | Array<VirtualNode> | null): VirtualNode {
  let vNode = null;

  if (isNull(sourceVNode)) {
    sourceVNode = createVirtualEmptyNode();
  }

  vNode = createVirtualNode('TAG', {
    name: 'root',
    children: isArray(sourceVNode) ? [...sourceVNode] : [sourceVNode],
  });

  return vNode;
}

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

  setMountedRoute([0]);
  setAppUid(zoneId);

  if (!isMounted) {
    let vNode: VirtualNode | Array<VirtualNode> = null;
    const registry = getRegistery();
    const app = createApp(container);

    container.innerHTML = '';
    registry.set(zoneId, app);
    vNode = mountVirtualDOM(source);
    vNode = createRootVirtualNode(vNode);
    vNode = buildVirtualNodeWithRoutes(vNode);
    app.vdom = vNode;
    Array.from(mountDOM(vNode, app.nativeElement).childNodes).forEach(node => container.appendChild(node));
    console.log('vNode: ', vNode);
    app.queue.forEach(fn => fn());
    app.queue = [];
  } else {
    const vNode = getVirtualDOM(zoneId);
    let nextVNode: VirtualNode | Array<VirtualNode> = null;

    nextVNode = mountVirtualDOM(source);
    nextVNode = createRootVirtualNode(nextVNode);
    nextVNode = buildVirtualNodeWithRoutes(nextVNode);
    console.log('nextVNode: ', nextVNode);
    processDOM({ vNode, nextVNode });
  }

  if (!isInternalRenderCall) {
    renderInProcess = false;
  } else {
    isInternalRenderCall = false;
    setAppUid(prevZoneId);
  }
}

export {
  renderComponent, //
};
