import { type DarkElement } from '../shared';
import { component } from '../component';
import { falseFn } from '../utils';
import { memo } from '../memo';

type GuardProps = {
  slot: DarkElement;
};

const Guard = memo(
  component<GuardProps>(({ slot }) => slot, { displayName: 'Guard' }),
  falseFn,
);

export { Guard };
