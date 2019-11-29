import { isObject } from '@helpers';
import { VirtualDOM } from '../vdom';

type ComponentDefinition<P> = (props: P) => any | {};

type ComponentOptions<P> = {
  displayName?: string;
  defaultProps?: Partial<P>;
  elementToken?: any;
};

export type ComponentFactory = {
  displayName: string;
  createElement: () => VirtualDOM | null;
  props: {
    key?: any;
    renderHook?: (vNode: VirtualDOM) => boolean;
  };
  elementToken: any;
} & { [key: string]: any };

export type Component<T extends object> = (props: T) => ComponentFactory;

type StandardComponentProps = {
  slot?: VirtualDOM | ComponentFactory | Array<ComponentFactory> | RenderProps;
} & { [key: string]: any };

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
    const computedProps = { ...defaultProps, ...props } as P;
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
  createComponent, //
  getIsComponentFactory,
};
