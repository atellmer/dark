import { isObject, error } from '@helpers';
import { VirtualDOM } from '../vdom';
import { MutableRef } from '../ref';
import { DARK, $$memo, $$fragment } from '../constants';

type ComponentDefinition<P> = (props: P, ref?: MutableRef) => any;

type ComponentOptions<P> = {
  displayName?: string;
  defaultProps?: Partial<P>;
  elementToken?: any;
};

export type ComponentFactory = {
  displayName: string;
  createElement: () => VirtualDOM | null;
  props: {
    key?: number | string;
  };
  elementToken: any;
} & { [key: string]: any };

export type Component<T = any> = (props: T, ref?: MutableRef) => ComponentFactory;

export type StandardComponentProps = {
  key?: number | string;
  ref?: MutableRef;
  slot?: VirtualDOM | ComponentFactory | Array<ComponentFactory> | RenderProps;
} & Partial<{ [key: string]: any }>;

type RenderProps = (...args: any) => VirtualDOM;

const $$defaultFunctionalComponent = Symbol('defaultFunctionalComponent');
const $$componentFactory = Symbol('componentFactory');
const refWhiteListMap = new Map()
  .set($$fragment, true)
  .set($$memo, true);

function createComponent<P extends object>(
  def: ComponentDefinition<P & StandardComponentProps>,
  options: ComponentOptions<P & StandardComponentProps> = null,
) {
  return (props = {} as P & StandardComponentProps, ref?: MutableRef): ComponentFactory => {
    const displayName = options ? options.displayName : '';
    const defaultProps = (options && options.defaultProps) || {};
    const computedProps = { ...defaultProps, ...props } as P & StandardComponentProps;
    const factory = {
      [$$componentFactory]: true,
      createElement: () => def(factory.props, ref),
      displayName,
      props: computedProps,
      elementToken: (options && options.elementToken) || $$defaultFunctionalComponent,
    };

    if (Boolean(computedProps.ref) && !refWhiteListMap.get(factory.elementToken)) {
      delete computedProps.ref;
      error(`[${DARK}]: To use ref you need to wrap the component with forwardRef!`);
    }

    return factory;
  };
}

const getIsComponentFactory = (o: any): o is ComponentFactory => o && isObject(o) && o[$$componentFactory] === true;

export {
  createComponent, //
  getIsComponentFactory,
};
