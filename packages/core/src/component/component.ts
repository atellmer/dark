import type { DarkElementKey, DarkElementInstance } from '../shared';
import { ATTR_KEY, ATTR_FLAG, Flag } from '../constants';
import { error, detectIsEmpty } from '../helpers';
import type { Ref } from '../ref';
import type { CreateElement, ComponentFactory, ComponentOptions, ShouldUpdate, StandardComponentProps } from './types';

const $$component = Symbol('component');
class Component<P extends StandardComponentProps = any, R = any> {
  public type: CreateElement<P>;
  public token: Symbol;
  public props: P;
  public ref: Ref<R>;
  public displayName: string;
  public children: Array<DarkElementInstance> = [];
  public shouldUpdate?: ShouldUpdate<P>;

  constructor(
    type: CreateElement<P>,
    token: Symbol,
    props: P,
    ref: Ref<R>,
    shouldUpdate: ShouldUpdate<P>,
    displayName: string,
  ) {
    this.type = type || null;
    this.token = token || $$component;
    this.props = props || null;
    this.ref = ref || null;
    this.shouldUpdate = shouldUpdate || null;
    this.displayName = displayName || '';
  }
}

function component<P, R = unknown>(type: CreateElement<P, R>, options: ComponentOptions<P> = {}) {
  const { token, displayName, shouldUpdate, keepRef = false } = options;
  const factory = (props = {} as P & StandardComponentProps, ref?: Ref<R>): Component<P & StandardComponentProps> => {
    if (!keepRef && props.ref) {
      delete props.ref;

      if (process.env.NODE_ENV !== 'production') {
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

const getComponentFlag = (instance: Component): Record<Flag, boolean> | null => instance.props[ATTR_FLAG] || null;

export { Component, component, detectIsComponent, getComponentKey, getComponentFlag };
