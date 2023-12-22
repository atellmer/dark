import {
  type ComponentFactory,
  type StandardComponentProps,
  type ShouldUpdate,
  type ComponentInject,
  $$inject,
} from '../component';
import type { SlotProps, RefProps } from '../shared';
import { $$memo } from './utils';

const defaultShouldUpdate = (props: {}, nextProps: {}): boolean => {
  const keys = Object.keys(nextProps);

  for (const key of keys) {
    if (key !== 'slot' && nextProps[key] !== props[key]) return true;
  }

  return false;
};

function memo<P extends object, R = unknown>(
  factory: ComponentFactory<P, R>,
  shouldUpdate: ShouldUpdate<P & SlotProps> = defaultShouldUpdate,
) {
  type P1 = P & Omit<StandardComponentProps, 'ref'> & RefProps<R>;

  factory[$$inject] = {
    token: $$memo,
    shouldUpdate,
  } as ComponentInject<P1>;

  return factory as ComponentFactory<P1, R>;
}

export { memo };
