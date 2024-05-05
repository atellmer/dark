import {
  type DarkElement,
  type Fiber,
  component,
  useMemo,
  $$scope,
  detectIsComponent,
  illegal,
  formatErrorMsg,
} from '@dark-engine/core';

import type { TagNativeElement } from '../native-element';
import { LIB } from '../constants';

const $$portal = Symbol('portal');

function createPortal(slot: DarkElement, container: TagNativeElement) {
  if (process.env.NODE_ENV !== 'production') {
    if (!(container instanceof Element)) {
      illegal(formatErrorMsg(LIB, `The createPortal only gets a valid element as container!`));
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
    const fiber = $$scope().getCursorFiber();

    useMemo(() => (element.innerHTML = ''), []);

    fiber.element = element;
    props.container = null;

    return props.slot;
  },
  { token: $$portal },
);

const detectIsPortal = (instance: unknown) => detectIsComponent(instance) && instance.token === $$portal;

const getPortalContainer = (fiber: Fiber<TagNativeElement>): TagNativeElement | null =>
  detectIsPortal(fiber.inst) ? fiber.element : null;

function unmountPortal(fiber: Fiber<TagNativeElement>) {
  const element = getPortalContainer(fiber);

  element && (element.innerHTML = '');
}

export { createPortal, unmountPortal, detectIsPortal };
