import { createComponent, detectIsComponentFactory } from '@core/component';
import { DarkElement } from '@core/shared/model';
import { error } from '@helpers';


const $$portal = Symbol('portal');
const Portal = createComponent(({ slot }) => slot, { token: $$portal });

function createPortal(slot: DarkElement, container: Element) {

  if (!(container instanceof Element)) {
    error(`[Dark]: createPortal receives only Element as container!`);
    return null;
  }

  if (!container[$$portal]) {
    container.innerHTML = '';
    container[$$portal] = true;
  }

  return Portal({ [$$portal]: container, slot });
}

const detectIsPortal = (factory: any): boolean => detectIsComponentFactory(factory) && factory.token === $$portal;
const getPortalContainer = (factory: any): Element => detectIsPortal(factory) ? factory.props[$$portal] : null;

export {
  createPortal,
  detectIsPortal,
  getPortalContainer,
};
