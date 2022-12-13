import { type Fiber, type DarkElement, type ComponentFactory } from '@dark-engine/core';
declare const $$portal: unique symbol;
declare function createPortal(
  slot: DarkElement,
  container: Element,
): ComponentFactory<
  PortalProps &
    import('@dark-engine/core').KeyProps &
    import('@dark-engine/core').RefProps<unknown> &
    import('@dark-engine/core').FlagProps,
  any
>;
declare type PortalProps = {
  [$$portal]: Element;
  slot: DarkElement;
};
declare const detectIsPortal: (factory: unknown) => factory is ComponentFactory<any, any>;
declare const getPortalContainer: (factory: unknown) => Element | null;
declare function unmountPortal(fiber: Fiber<Element>): void;
export { createPortal, detectIsPortal, getPortalContainer, unmountPortal };
