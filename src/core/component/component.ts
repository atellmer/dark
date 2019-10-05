import { isFunction, isObject, sanitize } from '@helpers';

type ComponentDefinition = (props) => any | {};

type ComponentOptions = {
  displayName?: string;
  defaultProps?: any;
};

type StatelessComponentFactoryType = {
  displayName: string;
  createElement: () => any;
  props: {
    key?: any;
  };
};

const $$statelessComponentFactory = Symbol('statelessComponentFactory');

function createComponent(def: ComponentDefinition, options: ComponentOptions = null) {
  return (props = {}) => {
    const isStateless = isFunction(def);
    const displayName = options ? options.displayName : '';
    const defaultProps = isStateless ? (options && options.defaultProps ? sanitize(options.defaultProps) : {}) : {};
    const computedProps = { ...defaultProps, ...sanitize(props) };

    return {
      [$$statelessComponentFactory]: true,
      createElement: () => def({ ...computedProps }),
      displayName,
      props: computedProps,
    } as StatelessComponentFactoryType;
  };
}

const isStatelessComponentFactory = f => f && isObject(f) && f[$$statelessComponentFactory] === true;

export {
  createComponent, //
  isStatelessComponentFactory,
};
