import { createComponent, detectIsComponentFactory } from '@dark/core/component';
import type { KeyProps } from '@dark/core/component';

const $$fragment = Symbol('fragment');

const Fragment = createComponent<KeyProps>(({ slot }) => slot || null, {
  token: $$fragment,
});

const detectIsFragment = (factory: unknown) => detectIsComponentFactory(factory) && factory.token === $$fragment;

export { Fragment, detectIsFragment };
