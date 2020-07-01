import { DarkElementKey } from '@core/shared';
import {
  CreateElement,
  ComponentOptions,
  StandardComponentProps,
} from './model';
import { ATTR_KEY } from '@core/constants';
import { VirtualNode } from '@core/view';


const $$component = Symbol('component');
const defaultOptions: ComponentOptions<any> = {
  displayName: '',
  defaultProps: {},
  token: $$component,
};

class ComponentFactory<P extends StandardComponentProps = any> {
  public type: CreateElement<P>;
  public token: Symbol;
  public props: P;
  public displayName: string;
  public children: Array<VirtualNode | ComponentFactory> = [];

  constructor(options: ComponentFactory<P>) {
    this.type = options.type || null;
    this.token = options.token || null;
    this.props = options.props || null;
    this.displayName = options.displayName || '';
  }
}

function createComponent<P extends StandardComponentProps>(
  createElement: CreateElement<P>, options: ComponentOptions<P> = {}) {
  const computedOptions = {...defaultOptions, ...options };
  const { defaultProps, displayName, token } = computedOptions;

  return (props = {} as P): ComponentFactory<P> => {
    const computedProps = { ...defaultProps, ...props } as P;
    const factory = new ComponentFactory({
      token,
      displayName,
      props: computedProps,
      type: createElement,
      children: [],
    });

    return factory;
  };
}

const detectIsComponentFactory = (factory: unknown): factory is ComponentFactory =>
  factory && factory instanceof ComponentFactory;

const getComponentFactoryKey = (factory: ComponentFactory): DarkElementKey => factory.props[ATTR_KEY];

export {
  ComponentFactory,
  createComponent,
  detectIsComponentFactory,
  getComponentFactoryKey,
};
