import {
  Component,
  StandardComponentProps,
  SlotProps,
  createComponent,
  detectIsComponentFactory,
} from '../component';
import { forwardRef } from '@core/ref';


type ShouldUpdate<T> = (props: T, nextProps: T) => boolean;

const $$memo = Symbol('memo');

const defaultShouldUpdate = (props: {}, nextProps: {}): boolean => {
  const keys = Object.keys(nextProps);

  for (const key of keys) {
    if (key !== 'slot' && nextProps[key] !== props[key]) {
      return true;
    }
  }

  return false;
}

const detectIsMemo = (factory: unknown) => detectIsComponentFactory(factory) && factory.token === $$memo;

function memo<T>(
  component: ReturnType<typeof createComponent>,
  shouldUpdate: ShouldUpdate<T & SlotProps> = defaultShouldUpdate): Component<T & StandardComponentProps> {
  return forwardRef(
    createComponent(
      (props, ref) => component(props, ref), { token: $$memo, shouldUpdate },
    ),
  );
}

export {
  $$memo,
  memo,
  detectIsMemo,
};
