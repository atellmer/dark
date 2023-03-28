import { type Fiber, type DarkElement, type Component, component, detectIsComponent, useMemo } from '@dark-engine/core';

import type { TagNativeElement } from '../native-element';

const $$portal = Symbol('portal');

function createPortal(slot: DarkElement, container: TagNativeElement) {
  if (process.env.NODE_ENV !== 'production') {
    if (!(container instanceof Element)) {
      throw new Error(`[Dark]: createPortal receives only Element as container!`);
    }
  }

  return Portal({ [$$portal]: container, slot });
}

type PortalProps = {
  [$$portal]: TagNativeElement;
  slot: DarkElement;
};

const Portal = component<PortalProps>(
  ({ slot, ...rest }) => {
    useMemo(() => (rest[$$portal].textContent = ''), []);

    return slot;
  },
  { token: $$portal },
);

const detectIsPortal = (instance: unknown): instance is Component =>
  detectIsComponent(instance) && instance.token === $$portal;

const getPortalContainer = (instance: unknown): TagNativeElement | null =>
  detectIsPortal(instance) ? instance.props[$$portal] : null;

function unmountPortal(fiber: Fiber<TagNativeElement>) {
  const container = getPortalContainer(fiber.instance);

  if (container) {
    container.textContent = '';
  }
}

export { createPortal, detectIsPortal, getPortalContainer, unmountPortal };
