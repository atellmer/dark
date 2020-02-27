import { createApp, getAppUid, getRegistery, getVirtualDOM, setAppUid } from '@core/scope';
import { VirtualNode, MountedSource } from '@core/vdom';
import { mountVirtualDOM } from '@core/vdom/mount';
import { isUndefined, isFunction, deepClone } from '../../../helpers';
import { mountRealDOM, processDOM } from '../dom/dom';
import Fiber, { setCurrentFiber } from '@core/fiber';

const zoneIdByRootNodeMap = new WeakMap();
let renderInProcess = false;
let isInternalRenderCall = false;
let zoneCount = 0;

function render(source: MountedSource, container: HTMLElement, onRender?: Function) {
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
    const registry = getRegistery();
    const app = createApp(container);

    container.innerHTML = '';
    registry.set(zoneId, app);

    const vNode = mountVirtualDOM({ mountedSource: source, fromRoot: true }) as VirtualNode;

    app.vdom = vNode;
    // console.log('vdom: ', deepClone(vNode));
    const nodes = Array.from(mountRealDOM(vNode, app.nativeElement as HTMLElement).childNodes);

    for (const node of nodes) {
      container.appendChild(node);
    }
  } else {
    const app = getRegistery().get(zoneId);
    const vNode = getVirtualDOM(zoneId);

    Fiber<AsyncRenderOptions, { mountedSource: MountedSource, fromRoot: boolean }>({
      fn: (effect, args) => {
        const options = {
          vNode: mountVirtualDOM(args) as VirtualNode,
          replaceState: true,
        };
        args.fromRoot && effect(options);
      },
      effect: (options) => {
        const {
          vNode: nextVNode,
          replaceState,
        } = options;
        if (replaceState) {
          setCurrentFiber(null);
          app.vdom = nextVNode;
          //console.log('vdom: ', deepClone(app.vdom));
        }
        processDOM({ vNode, nextVNode, container: app.nativeElement as HTMLElement });
      },
      mutateOptions: (options) => {
        options.replaceState = false;
        return options;
      },
    }).run({
      mountedSource: source,
      fromRoot: true,
    });
  }

  if (!isInternalRenderCall) {
    renderInProcess = false;
  } else {
    isInternalRenderCall = false;
    setAppUid(prevZoneId);
  }

  isFunction(onRender) && onRender();
}

type AsyncRenderOptions = {
  vNode: VirtualNode;
  replaceState: boolean;
};

export default render;
