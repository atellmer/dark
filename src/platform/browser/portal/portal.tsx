import { createComponent, detectIsComponentFactory } from '@core/component';
import { DarkElement } from '@core/shared/model';


const $$portal = Symbol('portal');

const Wrapper = createComponent(({ slot }) => slot, { token: $$portal });

type PortalProps = {
  container: Element;
};

const Portal = createComponent<PortalProps>(({ slot, container }) => {
  return Wrapper({
    [$$portal]: container,
    slot,
  });
});

function createPortal(slot: DarkElement, container: Element) {
  return Portal({ container, slot });
}

const detectIsPortal = (factory: any): boolean => detectIsComponentFactory(factory) && factory.token === $$portal;

const getPortalContainer = (factory: any): Element => detectIsPortal(factory) ? factory.props[$$portal] : null;

export {
  Portal,
  createPortal,
  detectIsPortal,
  getPortalContainer,
};
