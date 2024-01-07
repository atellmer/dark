import {
  type ComponentFactory,
  type StandardComponentProps,
  type ShouldUpdate,
  type ComponentInject,
  $$inject,
  detectIsComponent,
} from '../component';
import type { SlotProps, RefProps } from '../shared';

const $$memo = Symbol('memo');

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

const detectIsMemo = (instance: unknown) => detectIsComponent(instance) && instance.token === $$memo;

export { memo, detectIsMemo };
