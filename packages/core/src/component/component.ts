import { ATTR_KEY } from '../constants';
import { error, detectIsEmpty } from '../helpers';
import type { DarkElementKey, DarkElementInstance } from '../shared';
import type { Ref } from '../ref';
import type { CreateElement, ComponentOptions, ShouldUpdate, StandardComponentProps } from './types';

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
  public shouldUpdate?: ShouldUpdate<P>;

  constructor(
    type: CreateElement<P>,
    token: Symbol,
    props: P,
    ref: Ref<R>,
    shouldUpdate: ShouldUpdate<P>,
    displayName: string,
  ) {
    this.type = type || null;
    this.token = token || null;
    this.props = props || null;
    this.ref = ref || null;
    this.shouldUpdate = shouldUpdate || null;
    this.displayName = displayName || '';
  }
}

function createComponent<P, R = unknown>(type: CreateElement<P, R>, options: ComponentOptions<P> = {}) {
  const computedOptions = { ...defaultOptions, ...options } as ComponentOptions<P>;
  const { token, defaultProps, displayName, shouldUpdate } = computedOptions;
  const component = (
    props = {} as P & StandardComponentProps,
    ref?: Ref<R>,
  ): ComponentFactory<P & StandardComponentProps> => {
    const mprops = { ...defaultProps, ...props };

    if (mprops.ref) {
      delete mprops.ref;

      if (process.env.NODE_ENV === 'development') {
        error(`[Dark]: To use ref you need to wrap the createComponent with forwardRef!`);
      }
    }

    return new ComponentFactory(type, token, mprops, ref, shouldUpdate, displayName);
  };

  return component;
}

const detectIsComponentFactory = (factory: unknown): factory is ComponentFactory => factory instanceof ComponentFactory;

const getComponentFactoryKey = (factory: ComponentFactory): DarkElementKey =>
  !detectIsEmpty(factory.props[ATTR_KEY]) ? factory.props[ATTR_KEY] : null;

export { ComponentFactory, createComponent, detectIsComponentFactory, getComponentFactoryKey };
