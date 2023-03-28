import { type DarkElement } from '../shared';
import { component } from '../component';
import { memo } from '../memo';

type GuardProps = {
  slot: DarkElement;
};

const Guard = memo(
  component<GuardProps>(({ slot }) => slot),
  () => false,
);

export { Guard };
