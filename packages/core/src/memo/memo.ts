import { type ComponentFactory, type StandardComponentProps, type ShouldUpdate, component } from '../component';
import type { SlotProps, RefProps } from '../shared';
import { $$memo } from './utils';

const defaultShouldUpdate = (props: {}, nextProps: {}): boolean => {
  const keys = Object.keys(nextProps);

  for (const key of keys) {
    if (key !== 'slot' && nextProps[key] !== props[key]) {
      return true;
    }
  }

  return false;
};

function memo<P, R = unknown>(
  factory: ComponentFactory<P, R>,
  shouldUpdate: ShouldUpdate<P & SlotProps> = defaultShouldUpdate,
) {
  type Props = P & Omit<StandardComponentProps, 'ref'> & RefProps<R>;

  return component<Props, R>(factory, {
    token: $$memo,
    keepRef: true,
    shouldUpdate,
  }) as ComponentFactory<Props, R>;
}

export { memo };
