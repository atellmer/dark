import { type KeyProps, type SlotProps, createComponent, detectIsComponentFactory } from '../component';

type FragmentProps = Required<SlotProps> & KeyProps;

const $$fragment = Symbol('fragment');

const Fragment = createComponent<FragmentProps>(({ slot }) => slot || null, {
  token: $$fragment,
});

const detectIsFragment = (factory: unknown) => detectIsComponentFactory(factory) && factory.token === $$fragment;

export { Fragment, detectIsFragment };
