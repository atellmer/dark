import { createComponent, detectIsComponentFactory } from '../component';
import type { KeyProps } from '../component';

const $$fragment = Symbol('fragment');

const Fragment = createComponent<KeyProps>(({ slot }) => slot || null, {
  token: $$fragment,
});

const detectIsFragment = (factory: unknown) => detectIsComponentFactory(factory) && factory.token === $$fragment;

export { Fragment, detectIsFragment };
