import {
  type ComponentFactory,
  type StandardComponentProps,
  type ShouldUpdate,
  createComponent,
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
  component: ComponentFactory<P, R>,
  shouldUpdate: ShouldUpdate<P & SlotProps> = defaultShouldUpdate,
) {
  type Props = P & Omit<StandardComponentProps, 'ref'> & RefProps<R>;
  const component$ = createComponent<Props, R>(props => component(props), {
    token: $$memo,
    keepRef: true,
    shouldUpdate,
  });

  return component$ as ComponentFactory<Props, R>;
}

export { $$memo, memo, detectIsMemo };
