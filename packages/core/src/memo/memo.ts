import {
  type ComponentFactory,
  type StandardComponentProps,
  type ShouldUpdate,
  type ComponentInject,
  $$inject,
  detectIsComponent,
} from '../component';
import { type SlotProps, type Prettify } from '../shared';

const $$memo = Symbol('memo');

const defaultShouldUpdate = (props: {}, nextProps: {}): boolean => {
  for (const key in nextProps) {
    if (key !== 'slot' && nextProps[key] !== props[key]) return true;
  }

  return false;
};

function memo<P extends object>(
  factory: ComponentFactory<P>,
  shouldUpdate: ShouldUpdate<P & SlotProps> = defaultShouldUpdate,
) {
  type P1 = P & StandardComponentProps;

  factory[$$inject] = {
    token: $$memo,
    shouldUpdate,
  } as ComponentInject<P1>;

  return factory as ComponentFactory<Prettify<P1>>;
}

const detectIsMemo = (instance: unknown) => detectIsComponent(instance) && instance.token === $$memo;

export { memo, detectIsMemo };
