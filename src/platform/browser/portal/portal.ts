import { View, VirtualNode } from '@core/vdom/vnode';
import { createComponent, ComponentFactory } from '@core/component';
import { MountedSource } from '@core/vdom/mount';
import useMemo from '@core/hooks/use-memo';
import { createEmptyNode } from '../shared';


type PortalProps = {
  container: HTMLElement;
}

const $$portal = Symbol('portal');
const getIsPortal = (componentFactory: ComponentFactory): boolean =>
  componentFactory && componentFactory.elementToken === $$portal;

const Portal = createComponent<PortalProps>(({ slot, container }) => {
  const memoizedContainer = useMemo(() => {
    container.innerHTML = '';
    return container;
  }, []);

  const portal = View({
    as: 'portal-root',
    slot: slot || null,
  });

  portal.isPortal = true;
  portal.container = memoizedContainer;

  return portal;
}, { displayName: 'Portal', elementToken: $$portal });

function createPortal(source: MountedSource, container: HTMLElement) {
  return Portal({
    slot: source,
    container,
  });
}

function unmountPortalContainers(vNode: VirtualNode) {
  if (vNode.isPortal) {
    const container = vNode.container as HTMLElement;

    container.innerHTML = '';
    container.appendChild(createEmptyNode());
  }

  for (const childVNode of vNode.children) {
    unmountPortalContainers(childVNode);
  }
}

export {
  getIsPortal,
  unmountPortalContainers,
};
export default createPortal;
