import type { ElementKey, Instance, DarkElement, RefProps, KeyProps, FlagProps, Prettify } from '../shared';
import { KEY_ATTR } from '../constants';
import { error } from '../utils';
import { type Ref } from '../ref';

const $$inject = Symbol('inject');
class Component<P extends StandardComponentProps = any, R = any> {
  type: CreateElement<P>;
  props: P;
  ref?: Ref<R>;
  token?: Symbol;
  displayName?: string;
  shouldUpdate?: ShouldUpdate<P>;
  children: Array<Instance> = [];

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
          error(`[Dark]: to use ref you need to wrap the component with forwardRef!`);
      }
    }

    return new Component(type, token, props, ref, shouldUpdate, displayName);
  };

  return factory as ComponentFactory<Prettify<Props>, R>;
}

const defaultInject: ComponentInject = {};

const detectIsComponent = (x: unknown): x is Component => x instanceof Component;

const getComponentKey = (x: Component): ElementKey => x.props[KEY_ATTR] ?? null;

const hasComponentFlag = (inst: Component, flag: string) => Boolean(inst.props[flag]);

type ComponentOptions = Readonly<{
  displayName?: string;
  token?: Symbol;
}>;

type ComponentFactoryWithPossiblyInject<P extends object = {}, R = unknown> = {
  (props?: P, ref?: Ref<R>): Component<P, R>;
  [$$inject]?: ComponentInject<P>;
};

type CreateElement<P extends StandardComponentProps, R = unknown> = (props: P, ref?: Ref<R>) => DarkElement;

export type ComponentInject<P extends object = {}> = Readonly<{
  token?: Symbol;
  shouldUpdate?: ShouldUpdate<P>;
}>;

export type ShouldUpdate<P> = (prevProps: P, nextProps: P) => boolean;

export type StandardComponentProps = KeyProps & RefProps & FlagProps;

export type ComponentFactory<P extends object = {}, R = unknown> = (props?: P, ref?: Ref<R>) => Component<P, R>;

export { Component, component, $$inject, detectIsComponent, getComponentKey, hasComponentFlag };
