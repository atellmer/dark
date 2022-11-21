import {
  type Fiber,
  type DarkElement,
  type ComponentFactory,
  createComponent,
  detectIsComponentFactory,
  useMemo,
} from '@dark-engine/core';

const $$portal = Symbol('portal');

function createPortal(slot: DarkElement, container: Element) {
  if (!(container instanceof Element)) {
    throw new Error(`[Dark]: createPortal receives only Element as container!`);
  }

  return Portal({ [$$portal]: container, slot });
}

type PortalProps = {
  [$$portal]: Element;
  slot: DarkElement;
};

const Portal = createComponent<PortalProps>(
  ({ slot, ...rest }) => {
    useMemo(() => (rest[$$portal].innerHTML = ''), []);

    return slot;
  },
  { token: $$portal },
);

const detectIsPortal = (factory: unknown): factory is ComponentFactory =>
  detectIsComponentFactory(factory) && factory.token === $$portal;

const getPortalContainer = (factory: unknown): Element | null =>
  detectIsPortal(factory) ? factory.props[$$portal] : null;

function unmountPortal(fiber: Fiber<Element>) {
  const container = getPortalContainer(fiber.instance);

  if (container) {
    container.innerHTML = '';
  }
}

export { createPortal, detectIsPortal, getPortalContainer, unmountPortal };
