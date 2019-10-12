import { isFunction, isObject } from '@helpers';
import { VirtualNode, VirtualDOM } from '../vdom';

type ComponentDefinition<P> = (props: P) => any | {};

type ComponentOptions<P> = {
  displayName?: string;
  defaultProps?: Partial<P>;
};

export type StatelessComponentFactory = {
  displayName: string;
  createElement: () => VirtualNode | Array<VirtualNode> | null;
  props: {
    key?: any;
  };
};

export type RenderProps = (...args: any) => VirtualDOM;

type StandardComponentProps = {
  slot?: VirtualDOM | RenderProps;
}

const $$statelessComponentFactory = Symbol('statelessComponentFactory');

function createComponent<P>(
  def: ComponentDefinition<P & StandardComponentProps>, options: ComponentOptions<P & StandardComponentProps> = null) {
  return (props = {} as P & StandardComponentProps) => {
    const isStateless = isFunction(def);
    const displayName = options ? options.displayName : '';
    const defaultProps = isStateless ? (options && options.defaultProps || {}) : {};
    const computedProps = { ...defaultProps, ...props } as P;

    return {
      [$$statelessComponentFactory]: true,
      createElement: () => def({ ...computedProps }),
      displayName,
      props: computedProps,
    } as StatelessComponentFactory;
  };
}

const getIsStatelessComponentFactory = f => f && isObject(f) && f[$$statelessComponentFactory] === true;

export {
  createComponent, //
  getIsStatelessComponentFactory,
};
