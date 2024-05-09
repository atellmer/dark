import type { ElementKey, Instance, DarkElement, RefProps, KeyProps, Prettify } from '../shared';
import { KEY_ATTR } from '../constants';

const $$inject = Symbol('inject');
class Component<P extends StandardComponentProps = {}> {
  type: CreateElement<P> = null;
  props: P = null;
  token?: Symbol = null;
  displayName?: string = null;
  shouldUpdate?: ShouldUpdate<P> = null;
  children: Array<Instance> = [];

  constructor(type: CreateElement<P>, token: Symbol, props: P, shouldUpdate: ShouldUpdate<P>, displayName: string) {
    this.type = type;
    this.props = props;
    token && (this.token = token);
    shouldUpdate && (this.shouldUpdate = shouldUpdate);
    displayName && (this.displayName = displayName);
  }
}

function component<P extends object>(type: CreateElement<P>, options: ComponentOptions = {}) {
  const { token: $token, displayName } = options;
  type Props = P & StandardComponentProps;
  const factory: ComponentFactoryWithPossiblyInject<Props> = (props = {} as Props) => {
    const { token = $token, shouldUpdate } = factory[$$inject] || defaultInject;

    return new Component(type, token, props, shouldUpdate, displayName);
  };

  factory.displayName = displayName;

  return factory as ComponentFactory<Prettify<Props>>;
}

const defaultInject: ComponentInject = {};

const detectIsComponent = (x: unknown): x is Component => x instanceof Component;

const getComponentKey = (x: Component): ElementKey => x.props[KEY_ATTR] ?? null;

const hasComponentFlag = (inst: Component, flag: string) => Boolean(inst.props[flag]);

type ComponentOptions = Readonly<{
  displayName?: string;
  token?: Symbol;
}>;

type ComponentFactoryWithPossiblyInject<P extends object = {}> = {
  (props?: P): Component<P>;
  [$$inject]?: ComponentInject<P>;
  displayName: string;
};

type CreateElement<P extends StandardComponentProps> = (props: P) => DarkElement;

export type ComponentInject<P extends object = {}> = Readonly<{
  token?: Symbol;
  shouldUpdate?: ShouldUpdate<P>;
}>;

export type ShouldUpdate<P> = (prevProps: P, nextProps: P) => boolean;

export type StandardComponentProps = KeyProps & RefProps;

export type ComponentFactory<P extends object = {}> = {
  (props?: P): Component<P>;
  displayName?: string;
};

export { Component, component, $$inject, detectIsComponent, getComponentKey, hasComponentFlag };
