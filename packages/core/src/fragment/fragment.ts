import type { KeyProps, SlotProps } from '../shared';
import { component, detectIsComponent } from '../component';

type FragmentProps = Required<SlotProps> & KeyProps;

const $$fragment = Symbol('fragment');

const Fragment = component<FragmentProps>(({ slot }) => slot || null, {
  token: $$fragment,
  displayName: 'Fragment',
});

const detectIsFragment = (x: unknown) => detectIsComponent(x) && x.token === $$fragment;

export { Fragment, detectIsFragment };
