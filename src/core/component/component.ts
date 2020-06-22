import {
  ComponentDef,
  ComponentOptions,
  StandardComponentProps,
} from './model';
import { ATTR_KEY } from '../constants';


const $$component = Symbol('component');

class ComponentFactory<P extends StandardComponentProps = any> {
  public type: Function = null;
  public token: Symbol = null;
  public props: P = null;
  public displayName = '';
  public createElement: (props: P) => any = null;

  constructor(options: ComponentFactory<P>) {
    this.type = options.type;
    this.token = options.token;
    this.props = options.props;
    this.displayName = options.displayName;
    this.createElement = options.createElement;
  }
}

function createComponent<P extends StandardComponentProps>(def: ComponentDef<P>, options: ComponentOptions<P> = null) {
  const type = (props = {} as P): ComponentFactory<P> => {
    const displayName = options ? options.displayName : '';
    const defaultProps = (options && options.defaultProps) || {};
    const computedProps = { ...defaultProps, ...props } as P;
    const factory = new ComponentFactory({
      createElement: (props: P) => def(props),
      displayName,
      props: computedProps,
      token: (options && options.token) || $$component,
      type,
    });

    return factory;
  };

  return type;
}

const detectIsComponentFactory =
  (factory: unknown): factory is ComponentFactory => factory && factory instanceof ComponentFactory;

const getComponentKey = (factory: ComponentFactory): string | number => factory.props[ATTR_KEY];

export {
  ComponentFactory,
  createComponent,
  detectIsComponentFactory,
  getComponentKey,
};
