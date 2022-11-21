import {
  type Fiber,
  type DarkElement,
  type ComponentFactory,
  createComponent,
  detectIsComponentFactory,
  error,
  useMemo,
} from '@dark-engine/core';

const $$portal = Symbol('portal');

function createPortal(slot: DarkElement, container: Element) {
  if (!(container instanceof Element)) {
    if (process.env.NODE_ENV === 'development') {
      error(`[Dark]: createPortal receives only Element as container!`);
    }

    return null;
  }

  return Portal({ [$$portal]: container, slot });
}

const Portal = createComponent<any>(
  ({ slot, ...rest }) => {
    useMemo(() => (rest[$$portal].innerHTML = ''), []);

    return slot;
  },
  { token: $$portal },
);

const detectIsPortal = (factory: unknown): factory is ComponentFactory =>
  detectIsComponentFactory(factory) && factory.token === $$portal;

const getPortalContainer = (factory: unknown): Element => (detectIsPortal(factory) ? factory.props[$$portal] : null);

function unmountPortal(fiber: Fiber<Element>) {
  if (detectIsPortal(fiber.instance)) {
    const container = getPortalContainer(fiber.instance);

    container.innerHTML = '';
  }
}

export { createPortal, detectIsPortal, getPortalContainer, unmountPortal };
