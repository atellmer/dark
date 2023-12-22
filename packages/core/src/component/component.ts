import { type ElementKey, type Instance } from '../shared';
import { ATTR_KEY } from '../constants';
import { error } from '../helpers';
import { type Ref } from '../ref';
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
  public children: Array<Instance> = [];

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

function component<P extends object, R = unknown>(type: CreateElement<P, R>, options: ComponentOptions = {}) {
  const { token: $token, displayName } = options;
  type Props = P & StandardComponentProps;
  const factory: ComponentFactoryWithPossiblyInject<Props, R> = (props = {} as Props, ref?: Ref<R>) => {
    const { token = $token, shouldUpdate } = factory[$$inject] || defaultInject;

    if (props.ref) {
      delete props.ref;

      if (process.env.NODE_ENV !== 'production') {
        process.env.NODE_ENV === 'development' &&
          error(`[Dark]: To use ref you need to wrap the component with forwardRef!`);
      }
    }

    return new Component(type, token, props, ref, shouldUpdate, displayName);
  };

  return factory as ComponentFactory<Props, R>;
}

const defaultInject: ComponentInject = {};

const detectIsComponent = (x: unknown): x is Component => x instanceof Component;

const getComponentKey = (x: Component): ElementKey => x.props[ATTR_KEY] ?? null;

const hasComponentFlag = (inst: Component, flag: string) => Boolean(inst.props[flag]);

export { Component, component, $$inject, detectIsComponent, getComponentKey, hasComponentFlag };
