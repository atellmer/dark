import type { DarkElementKey, DarkElementInstance } from '../shared';
import { ATTR_KEY } from '../constants';
import { error } from '../helpers';
import type { Ref } from '../ref';
import type {
  CreateElement,
  ComponentFactory,
  ComponentOptions,
  ShouldUpdate,
  StandardComponentProps,
  ComponentInject,
  ComponentFactoryWithPossiblyInject,
} from './types';

const $$inject = Symbol('inject');
class Component<P extends StandardComponentProps = any, R = any> {
  public type: CreateElement<P>;
  public props: P;
  public ref?: Ref<R>;
  public token?: Symbol;
  public displayName?: string;
  public shouldUpdate?: ShouldUpdate<P>;
  public children: Array<DarkElementInstance> = [];

  constructor(
    type: CreateElement<P>,
    token: Symbol,
    props: P,
    ref: Ref<R>,
    shouldUpdate: ShouldUpdate<P>,
    displayName: string,
  ) {
    this.type = type;
    this.props = props;
    ref && (this.ref = ref);
    token && (this.token = token);
    shouldUpdate && (this.shouldUpdate = shouldUpdate);
    displayName && (this.displayName = displayName);
  }
}

function component<P, R = unknown>(type: CreateElement<P, R>, options: ComponentOptions = {}) {
  const { token: token$, displayName } = options;
  type P1 = P & StandardComponentProps;
  const factory: ComponentFactoryWithPossiblyInject<P1, R> = (props = {} as P1, ref?: Ref<R>) => {
    const { token = token$, shouldUpdate } = factory[$$inject] || defaultInject;

    if (props.ref) {
      delete props.ref;

      if (process.env.NODE_ENV !== 'production') {
        process.env.NODE_ENV === 'development' &&
          error(`[Dark]: To use ref you need to wrap the component with forwardRef!`);
      }
    }

    return new Component(type, token, props, ref, shouldUpdate, displayName);
  };

  return factory as ComponentFactory<P1, R>;
}

const defaultInject: ComponentInject = {};

const detectIsComponent = (inst: unknown): inst is Component => inst instanceof Component;

const getComponentKey = (inst: Component): DarkElementKey => inst.props[ATTR_KEY] ?? null;

const hasComponentFlag = (instance: Component, flag: string) => Boolean(instance.props[flag]);

export { Component, component, $$inject, detectIsComponent, getComponentKey, hasComponentFlag };
