import {
  type ComponentFactory,
  type StandardComponentProps,
  type ShouldUpdate,
  component,
  detectIsComponent,
} from '../component';
import type { SlotProps, RefProps } from '../shared';

const $$memo = Symbol('memo');

const defaultShouldUpdate = (props: {}, nextProps: {}): boolean => {
  const keys = Object.keys(nextProps);

  for (const key of keys) {
    if (key !== 'slot' && nextProps[key] !== props[key]) {
      return true;
    }
  }

  return false;
};

const detectIsMemo = (instance: unknown) => detectIsComponent(instance) && instance.token === $$memo;

function memo<P, R = unknown>(
  factory: ComponentFactory<P, R>,
  shouldUpdate: ShouldUpdate<P & SlotProps> = defaultShouldUpdate,
) {
  type Props = P & Omit<StandardComponentProps, 'ref'> & RefProps<R>;

  return component<Props, R>(props => factory(props), {
    token: $$memo,
    keepRef: true,
    shouldUpdate,
  }) as ComponentFactory<Props, R>;
}

export { $$memo, memo, detectIsMemo };
