import { createComponent, StandardComponentProps, Component } from '../component';
import { Memo, $$memo } from '../use-memo';


type ShouldUpdate<T> = (props: T, nextProps: T) => boolean;

const $$memoProps = Symbol('memoProps');

const defaultShouldUpdate = (props: {}, nextProps: {}): boolean => {
  const keys = Object.keys(nextProps);

  for (const key of keys) {
    if (key !== 'slot' && nextProps[key] !== props[key]) {
      return true;
    }
  }

  return false;
}

function memo<T>(
  component: ReturnType<typeof createComponent>,
  shouldUpdate: ShouldUpdate<T> = defaultShouldUpdate): Component<T & StandardComponentProps> {
  return createComponent(props => {
    return Memo({
      [$$memoProps]: props,
      [$$memo]: shouldUpdate,
      slot: component(props),
    });
  });
}

export {
  $$memoProps,
  memo,
};
