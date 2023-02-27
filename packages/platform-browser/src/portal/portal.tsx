import {
  type Fiber,
  type DarkElement,
  type Component,
  createComponent,
  detectIsComponent,
  useMemo,
} from '@dark-engine/core';

import type { TagNativeElement } from '../native-element';

const $$portal = Symbol('portal');

function createPortal(slot: DarkElement, container: TagNativeElement) {
  if (!(container instanceof Element)) {
    throw new Error(`[Dark]: createPortal receives only Element as container!`);
  }

  return Portal({ [$$portal]: container, slot });
}

type PortalProps = {
  [$$portal]: TagNativeElement;
  slot: DarkElement;
};

const Portal = createComponent<PortalProps>(
  ({ slot, ...rest }) => {
    useMemo(() => (rest[$$portal].innerHTML = ''), []);

    return slot;
  },
  { token: $$portal },
);

const detectIsPortal = (instance: unknown): instance is Component =>
  detectIsComponent(instance) && instance.token === $$portal;

const getPortalContainer = (factory: unknown): TagNativeElement | null =>
  detectIsPortal(factory) ? factory.props[$$portal] : null;

function unmountPortal(fiber: Fiber<TagNativeElement>) {
  const container = getPortalContainer(fiber.instance);

  if (container) {
    container.innerHTML = '';
  }
}

export { createPortal, detectIsPortal, getPortalContainer, unmountPortal };
