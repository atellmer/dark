import type { DarkElementKey, DarkElementInstance } from '../shared';
import { ATTR_KEY } from '../constants';
import { error, detectIsEmpty } from '../helpers';
import type { Ref } from '../ref';
import type { CreateElement, ComponentFactory, ComponentOptions, ShouldUpdate, StandardComponentProps } from './types';

const $$component = Symbol('component');
class Component<P extends StandardComponentProps = any, R = any> {
  public type: CreateElement<P>;
  public token: Symbol;
  public props: P;
  public ref: Ref<R>;
  public dn: string;
  public su?: ShouldUpdate<P>;
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
    this.token = token || $$component;
    this.props = props;
    ref && (this.ref = ref);
    shouldUpdate && (this.su = shouldUpdate);
    displayName && (this.dn = displayName);
  }
}

function component<P, R = unknown>(type: CreateElement<P, R>, options: ComponentOptions<P> = {}) {
  const { token, displayName, shouldUpdate, keepRef = false } = options;
  const factory = (props = {} as P & StandardComponentProps, ref?: Ref<R>): Component<P & StandardComponentProps> => {
    if (!keepRef && props.ref) {
      delete props.ref;

      if (process.env.NODE_ENV !== 'production') {
        process.env.NODE_ENV === 'development' &&
          error(`[Dark]: To use ref you need to wrap the component with forwardRef!`);
      }
    }

    return new Component(type, token, props, ref, shouldUpdate, displayName);
  };

  return factory as ComponentFactory<P & StandardComponentProps, R>;
}

const detectIsComponent = (instance: unknown): instance is Component => instance instanceof Component;

const getComponentKey = (instance: Component): DarkElementKey =>
  !detectIsEmpty(instance.props[ATTR_KEY]) ? instance.props[ATTR_KEY] : null;

const hasComponentFlag = (instance: Component, flag: string) => Boolean(instance.props[flag]);

export { Component, component, detectIsComponent, getComponentKey, hasComponentFlag };
