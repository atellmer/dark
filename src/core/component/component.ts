import { isFunction, isObject } from '@helpers';
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

type StandardComponentProps = {
  slot?: VirtualDOM | ComponentFactory | Array<ComponentFactory> | RenderProps;
} & { [key: string]: any };

export type RenderProps = (...args: any) => VirtualDOM;

const $$defaultFunctionalComponent = Symbol('defaultFunctionalComponent');
const $$componentFactory = Symbol('componentFactory');
const $$renderHook = Symbol('renderHook');
const $$nodeRouteHook = Symbol('nodeRouteHook');

function createComponent<P>(
  def: ComponentDefinition<P & StandardComponentProps>,
  options: ComponentOptions<P & StandardComponentProps> = null,
) {
  return (props = {} as P & StandardComponentProps): ComponentFactory => {
    const isStateless = isFunction(def);
    const displayName = options ? options.displayName : '';
    const defaultProps = isStateless ? (options && options.defaultProps) || {} : {};
    const computedProps = { ...defaultProps, ...props } as P;

    return {
      [$$componentFactory]: true,
      createElement: () => def({ ...computedProps }),
      displayName,
      props: computedProps,
      elementToken: (options && options.elementToken) || $$defaultFunctionalComponent,
    };
  };
}

const getIsComponentFactory = (o: any): o is ComponentFactory => o && isObject(o) && o[$$componentFactory] === true;

export {
  createComponent, //
  $$renderHook,
  $$nodeRouteHook,
  getIsComponentFactory,
};
