import { isFunction, isObject } from '@helpers';
import { VirtualDOM } from '../vdom';

type ComponentDefinition<P> = (props: P) => any | {};

type ComponentOptions<P> = {
  displayName?: string;
  defaultProps?: Partial<P>;
  elementToken?: any;
};

export type StatelessComponentFactory = {
  displayName: string;
  createElement: () => VirtualDOM | null;
  props: {
    key?: any;
  };
  elementToken: any;
};

export type RenderProps = (...args: any) => VirtualDOM;

type StandardComponentProps = {
  slot?: VirtualDOM | StatelessComponentFactory | Array<StatelessComponentFactory> | RenderProps;
};

const $$defaultFunctionalComponent = Symbol('defaultFunctionalComponent');
const $$statelessComponentFactory = Symbol('statelessComponentFactory');

function createComponent<P>(
  def: ComponentDefinition<P & StandardComponentProps>,
  options: ComponentOptions<P & StandardComponentProps> = null,
) {
  return (props = {} as P & StandardComponentProps) => {
    const isStateless = isFunction(def);
    const displayName = options ? options.displayName : '';
    const defaultProps = isStateless ? (options && options.defaultProps) || {} : {};
    const computedProps = { ...defaultProps, ...props } as P;

    return {
      [$$statelessComponentFactory]: true,
      createElement: () => def({ ...computedProps }),
      displayName,
      props: computedProps,
      elementToken: (options && options.elementToken) || $$defaultFunctionalComponent,
    } as StatelessComponentFactory;
  };
}

const getIsStatelessComponentFactory = f => f && isObject(f) && f[$$statelessComponentFactory] === true;

export {
  createComponent, //
  getIsStatelessComponentFactory,
};
