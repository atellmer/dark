import { ATTR_KEY } from '../constants';
import { error, detectIsEmpty } from '../helpers';
import type { DarkElementKey, DarkElementInstance } from '../shared';
import type { Ref } from '../ref';
import type { CreateElement, ComponentOptions, StandardComponentProps } from './types';

const $$component = Symbol('component');
const defaultOptions: ComponentOptions<any> = {
  displayName: '',
  defaultProps: {},
  token: $$component,
};
class ComponentFactory<P extends StandardComponentProps = any, R = any> {
  public type: CreateElement<P>;
  public token: Symbol;
  public props: P;
  public ref: Ref<R>;
  public displayName: string;
  public children: Array<DarkElementInstance> = [];
  public shouldUpdate?: (props: P, nextProps: P) => boolean;

  constructor(options: ComponentFactory<P>) {
    this.type = options.type || null;
    this.token = options.token || null;
    this.props = options.props || null;
    this.ref = options.ref || null;
    this.displayName = options.displayName || '';
    this.shouldUpdate = options.shouldUpdate || null;
  }
}

function createComponent<P, R = any>(createElement: CreateElement<P, R>, options: ComponentOptions<P> = {}) {
  type Props = P & StandardComponentProps;
  const computedOptions = { ...defaultOptions, ...options };
  const { token, defaultProps, displayName, shouldUpdate } = computedOptions;

  return (props = {} as Props, ref?: Ref<R>): ComponentFactory<Props> => {
    const computedProps = { ...defaultProps, ...props };
    const factory = new ComponentFactory({
      token,
      ref,
      displayName,
      shouldUpdate,
      props: computedProps,
      type: createElement,
      children: [],
    });

    if (computedProps.ref) {
      delete computedProps.ref;

      if (process.env.NODE_ENV === 'development') {
        error(`[Dark]: To use ref you need to wrap the createComponent with forwardRef!`);
      }
    }

    return factory;
  };
}

const detectIsComponentFactory = (factory: unknown): factory is ComponentFactory => factory instanceof ComponentFactory;

const getComponentFactoryKey = (factory: ComponentFactory): DarkElementKey =>
  !detectIsEmpty(factory.props[ATTR_KEY]) ? factory.props[ATTR_KEY] : null;

export { ComponentFactory, createComponent, detectIsComponentFactory, getComponentFactoryKey };
