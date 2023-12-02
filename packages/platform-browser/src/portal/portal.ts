import { type DarkElement, component, useMemo, $$scope } from '@dark-engine/core';

import type { TagNativeElement } from '../native-element';
import { $$portal } from './utils';

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
    const fiber = $$scope().getCursorFiber();

    useMemo(() => (element.innerHTML = ''), []);

    fiber.element = element;
    props.container = null;

    return props.slot;
  },
  { token: $$portal },
);

export { createPortal };
