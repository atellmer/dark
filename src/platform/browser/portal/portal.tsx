import { Fiber } from '@core/fiber';
import { DarkElement } from '@core/shared/model';
import {
  createComponent,
  detectIsComponentFactory,
  ComponentFactory,
} from '@core/component';
import { error } from '@helpers';
import { useMemo } from '@core';


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

const Portal = createComponent(({ slot, ...rest }) => {
  useMemo(() => rest[$$portal].innerHTML = '', []);

  return slot;
}, { token: $$portal });

const detectIsPortal = (factory: unknown): factory is ComponentFactory =>
  detectIsComponentFactory(factory) && factory.token === $$portal;
const getPortalContainer = (factory: unknown): Element => detectIsPortal(factory) ? factory.props[$$portal] : null;

export {
  createPortal,
  detectIsPortal,
  getPortalContainer,
};
