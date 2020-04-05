import { isObject, error } from '@helpers';


type ComponentDefinition<P> = (props: P) => any;

type ComponentOptions<P> = {
  displayName?: string;
  defaultProps?: Partial<P>;
  elementToken?: any;
};

export type ComponentFactory = {
  displayName: string;
  createElement: () => any;
  props: {
    key?: number | string;
  };
  elementToken: any;
} & { [key: string]: any };

export type Component<T = any> = (props: T) => ComponentFactory;

export type StandardComponentProps = {
  key?: number | string;
  slot?: VirtualDOM | ComponentFactory | Array<ComponentFactory> | RenderProps;
} & Partial<{ [key: string]: any }>;

type RenderProps = (...args: any) => VirtualDOM;

const $$defaultFunctionalComponent = Symbol('defaultFunctionalComponent');
const $$componentFactory = Symbol('componentFactory');

function createComponent<P extends object>(
  def: ComponentDefinition<P & StandardComponentProps>,
  options: ComponentOptions<P & StandardComponentProps> = null,
) {
  return (props = {} as P & StandardComponentProps): ComponentFactory => {
    const displayName = options ? options.displayName : '';
    const defaultProps = (options && options.defaultProps) || {};
    const computedProps = { ...defaultProps, ...props } as P & StandardComponentProps;
    const factory = {
      [$$componentFactory]: true,
      createElement: () => def(factory.props),
      displayName,
      props: computedProps,
      elementToken: (options && options.elementToken) || $$defaultFunctionalComponent,
    };

    return factory;
  };
}

const getIsComponentFactory = (o: any): o is ComponentFactory => o && isObject(o) && o[$$componentFactory] === true;

export {
  createComponent,
  getIsComponentFactory,
};
