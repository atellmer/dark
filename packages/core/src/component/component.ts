import type { Instance, DarkElement, RefProps, KeyProps, Prettify } from '../shared';

const $$inject = Symbol('inject');
class Component<P extends StandardComponentProps = {}> {
  kind: CreateElement<P> = null;
  props: P = null;
  token?: Symbol = null;
  displayName?: string = null;
  shouldUpdate?: ShouldUpdate<P> = null;
  children: Array<Instance> = [];

  constructor(kind: CreateElement<P>, token: Symbol, props: P, shouldUpdate: ShouldUpdate<P>, displayName: string) {
    this.kind = kind;
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

export { Component, component, $$inject, detectIsComponent };
