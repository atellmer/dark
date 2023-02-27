import { createComponent, detectIsComponent } from '../component';
import type { KeyProps, SlotProps } from '../shared';

type FragmentProps = Required<SlotProps> & KeyProps;

const $$fragment = Symbol('fragment');

const Fragment = createComponent<FragmentProps>(({ slot }) => slot || null, {
  token: $$fragment,
});

const detectIsFragment = (instance: unknown) => detectIsComponent(instance) && instance.token === $$fragment;

export { Fragment, detectIsFragment };
