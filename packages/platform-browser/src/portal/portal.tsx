import {
  type Fiber,
  type DarkElement,
  type Component,
  component,
  detectIsComponent,
  useMemo,
  currentFiberStore,
} from '@dark-engine/core';

import type { TagNativeElement } from '../native-element';

const $$portal = Symbol('portal');

function createPortal(slot: DarkElement, container: TagNativeElement) {
  if (process.env.NODE_ENV !== 'production') {
    if (!(container instanceof Element)) {
      throw new Error(`[Dark]: createPortal receives only Element as container!`);
    }
  }

  return Portal({ container, slot });
}

type PortalProps = {
  container: TagNativeElement;
  slot: DarkElement;
};

const Portal = component<PortalProps>(
  props => {
    const element = props.container;
    const fiber = currentFiberStore.get();

    useMemo(() => (element.textContent = ''), []);

    fiber.element = element;
    delete props.container;

    return props.slot;
  },
  { token: $$portal },
);

const detectIsPortal = (instance: unknown): instance is Component =>
  detectIsComponent(instance) && instance.token === $$portal;

const getPortalContainer = (fiber: Fiber<TagNativeElement>): TagNativeElement | null =>
  detectIsPortal(fiber.inst) ? fiber.element : null;

function unmountPortal(fiber: Fiber<TagNativeElement>) {
  const element = getPortalContainer(fiber);

  element && (element.textContent = '');
}

export { createPortal, detectIsPortal, getPortalContainer, unmountPortal };
