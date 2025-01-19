import {
  type DarkElement,
  type ElementKey,
  component,
  useMemo,
  useLayoutEffect,
  __useCursor as useCursor,
} from '@dark-engine/core';

import type { TagNativeElement } from '../native-element';
import { illegal, removeContent } from '../utils';

const $$portal = Symbol('portal');

function createPortal(slot: DarkElement, container: TagNativeElement, key?: ElementKey) {
  if (process.env.NODE_ENV !== 'production') {
    if (!(container instanceof Element)) {
      illegal(`The createPortal only gets a valid element as container!`);
    }
  }

  return Portal({ key, container, slot });
}

type PortalProps = {
  container: TagNativeElement;
  slot: DarkElement;
};

const Portal = component<PortalProps>(
  props => {
    const cursor = useCursor();
    const el = props.container;
    const scope = useMemo(() => {
      removeContent(el);
      return { el };
    }, []);

    useLayoutEffect(() => {
      return () => removeContent(scope.el);
    }, []);

    cursor.hook.setIsPortal(true);
    cursor.el = el;
    scope.el = el;

    return props.slot;
  },
  { token: $$portal, displayName: 'Portal' },
);

export { createPortal };
