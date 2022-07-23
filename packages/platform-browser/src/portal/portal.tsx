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
  let nextFiber = fiber;
  let isDeepWalking = true;
  let isReturn = false;

  while (nextFiber) {
    if (!isReturn && detectIsPortal(nextFiber.instance)) {
      const container = getPortalContainer(nextFiber.instance);

      container.innerHTML = '';
    }

    if (!nextFiber.portalHost) {
      isDeepWalking = false;
    }

    if (nextFiber.child && isDeepWalking) {
      nextFiber = nextFiber.child;
      isReturn = false;
    } else if (nextFiber.nextSibling && nextFiber.nextSibling !== fiber.nextSibling) {
      isDeepWalking = true;
      isReturn = false;
      nextFiber = nextFiber.nextSibling;
    } else if (
      nextFiber.parent &&
      nextFiber !== fiber &&
      nextFiber.parent !== fiber &&
      nextFiber.parent !== fiber.parent
    ) {
      isDeepWalking = false;
      isReturn = true;
      nextFiber = nextFiber.parent;
    } else {
      nextFiber = null;
    }
  }
}

export { createPortal, detectIsPortal, getPortalContainer, unmountPortal };
