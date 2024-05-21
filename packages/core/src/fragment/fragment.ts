import type { KeyProps, SlotProps, DarkElement } from '../shared';
import { component, detectIsComponent } from '../component';
import { flatten } from '../utils';

type FragmentProps = Required<SlotProps> & KeyProps;

const $$fragment = Symbol('fragment');

const Fragment = component<FragmentProps>(({ slot }) => flatten(slot as Array<DarkElement>), {
  token: $$fragment,
  displayName: 'Fragment',
});

const detectIsFragment = (x: unknown) => detectIsComponent(x) && x.token === $$fragment;

export { Fragment, detectIsFragment };
