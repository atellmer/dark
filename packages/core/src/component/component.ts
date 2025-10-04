import type { ElementKey, Instance, DarkElement, RefProps, KeyProps, Prettify } from '../shared';
import { KEY_ATTR } from '../constants';
class Component<P extends StandardComponentProps = {}> {
  type: CreateElement<P> = null;
  props: P = null;
  token?: Symbol = null;
  displayName: string = '';
  shouldUpdate: ShouldUpdate<P> = null;
  children: Array<Instance> = null;

  constructor(type: CreateElement<P>, props: P, token: Symbol = null, displayName: string = '') {
    this.type = type;
    this.props = props;
    this.token = token;
    this.displayName = displayName;
  }

  inject(shouldUpdate: ShouldUpdate<P>, token: Symbol) {
    this.shouldUpdate = shouldUpdate;
    this.token = token;

    return this;
  }
}

function component<P extends object>(type: CreateElement<P>, options: ComponentOptions = {}) {
  type Props = P & StandardComponentProps;
  const { token, displayName } = options;
  const factory: ComponentFactory<Props> = (props = {} as Props) => new Component(type, props, token, displayName);

  factory.displayName = displayName;

  return factory as ComponentFactory<Prettify<Props>>;
}

const detectIsComponent = (x: unknown): x is Component => x instanceof Component;

const getComponentKey = (x: Component): ElementKey => x.props[KEY_ATTR] ?? null;

type ComponentOptions = Readonly<{
  displayName?: string;
  token?: Symbol;
}>;

type CreateElement<P extends StandardComponentProps> = (props: P) => DarkElement;

export type ShouldUpdate<P> = (prevProps: P, nextProps: P) => boolean;

export type StandardComponentProps = KeyProps & RefProps;

export type ComponentFactory<P extends object = {}> = {
  (props?: P): Component<P>;
  displayName?: string;
};

export { Component, component, detectIsComponent, getComponentKey };
