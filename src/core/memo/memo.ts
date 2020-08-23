import {
  Component,
  StandardComponentProps,
  createComponent,
  detectIsComponentFactory,
} from '../component';


type ShouldUpdate<T> = (props: T, nextProps: T) => boolean;

const $$memo = Symbol('memo');
const Memoize = createComponent(({ slot }) => slot, { token: $$memo });
const defaultShouldUpdate = (props: {}, nextProps: {}): boolean => {
  const keys = Object.keys(nextProps);

  for (const key of keys) {
    if (key !== 'slot' && nextProps[key] !== props[key]) {
      return true;
    }
  }

  return false;
}

const detectIsMemo = (o: any) => detectIsComponentFactory(o) && o.token === $$memo;

function memo<T>(
  component: ReturnType<typeof createComponent>,
  shouldUpdate: ShouldUpdate<T> = defaultShouldUpdate): Component<T & StandardComponentProps> {
  return createComponent(props => {
    return Memoize({
      [$$memo]: shouldUpdate,
      slot: component(props),
    });
  });
}

export {
  $$memo,
  Memoize,
  memo,
  detectIsMemo,
};
