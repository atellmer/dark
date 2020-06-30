import {
  CreateElement,
  ComponentOptions,
  StandardComponentProps,
} from './model';
import { ATTR_KEY } from '../constants';
import { VirtualNode } from '../view';


const $$component = Symbol('component');

class ComponentFactory<P extends StandardComponentProps = any> {
  public type: CreateElement<P> = null;
  public token: Symbol = null;
  public props: P = null;
  public displayName = '';
  public children: Array<VirtualNode | ComponentFactory>;

  constructor(options: ComponentFactory<P>) {
    this.type = options.type;
    this.token = options.token;
    this.props = options.props;
    this.displayName = options.displayName;
  }
}

function createComponent<P extends StandardComponentProps>(createElement: CreateElement<P>, options: ComponentOptions<P> = null) {
  const displayName = options ? options.displayName : '';
  const defaultProps = (options && options.defaultProps) || {};
  const token = (options && options.token) || $$component;

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

const detectIsComponentFactory =
  (factory: unknown): factory is ComponentFactory => factory && factory instanceof ComponentFactory;

const getComponentFactoryKey = (factory: ComponentFactory): string | number => factory.props[ATTR_KEY];

export {
  ComponentFactory,
  createComponent,
  detectIsComponentFactory,
  getComponentFactoryKey,
};
