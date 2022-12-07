import {
  type Component,
  type ComponentFactory,
  type StandardComponentProps,
  type ShouldUpdate,
  createComponent,
  detectIsComponentFactory,
} from '../component';
import type { RefProps, SlotProps } from '../shared';
import { type Ref, forwardRef } from '../ref';

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

const detectIsMemo = (factory: unknown) => detectIsComponentFactory(factory) && factory.token === $$memo;

function memo<T>(
  component: (props?: T, ref?: Ref) => ComponentFactory<T>,
  shouldUpdate: ShouldUpdate<T & SlotProps> = defaultShouldUpdate,
): Component<T & StandardComponentProps> {
  return forwardRef(
    createComponent(
      (props: T & RefProps, ref) => {
        ref && (props.ref = ref);

        return component(props);
      },
      { token: $$memo, shouldUpdate },
    ),
  );
}

export { $$memo, memo, detectIsMemo };
