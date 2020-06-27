import {
  CreateElement,
  ComponentOptions,
  StandardComponentProps,
} from './model';
import { ATTR_KEY } from '../constants';
import { DarkElement } from '../shared/model';
import { createElement } from '@core/view';


const $$component = Symbol('component');

class ComponentFactory<P extends StandardComponentProps = any> {
  public type: Function = null;
  public token: Symbol = null;
  public props: P = null;
  public displayName = '';
  public createElement: (props: P) => DarkElement = null;

  constructor(options: ComponentFactory<P>) {
    this.type = options.type;
    this.token = options.token;
    this.props = options.props;
    this.displayName = options.displayName;
    this.createElement = options.createElement;
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
      createElement,
      props: computedProps,
      type: createElement,
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
