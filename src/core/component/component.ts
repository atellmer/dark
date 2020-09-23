import { DarkElementKey } from '@core/shared/model';
import {
  CreateElement,
  ComponentOptions,
  StandardComponentProps,
  SlotProps,
} from './model';
import { ATTR_KEY, REF_ERROR } from '@core/constants';
import { VirtualNode } from '@core/view';
import { MutableRef } from '../ref';
import { error } from '@helpers';


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
  public ref: MutableRef<R>;
  public displayName: string;
  public children: Array<VirtualNode | ComponentFactory> = [];

  constructor(options: ComponentFactory<P>) {
    this.type = options.type || null;
    this.token = options.token || null;
    this.props = options.props || null;
    this.ref = options.ref || null;
    this.displayName = options.displayName || '';
  }
}

function createComponent<P, R = any>(createElement: CreateElement<P & SlotProps, R>, options: ComponentOptions<P> = {}) {
  type Props = P & StandardComponentProps;
  const computedOptions = {...defaultOptions, ...options };
  const {
    defaultProps,
    displayName,
    token,
  } = computedOptions;

  return (props = {} as Props, ref?: MutableRef<R>): ComponentFactory<Props> => {
    const computedProps = { ...defaultProps, ...props };
    const factory = new ComponentFactory({
      token,
      ref,
      displayName,
      props: computedProps,
      type: createElement,
      children: [],
    });

    if (computedProps.ref) {
      delete computedProps.ref;
      error(REF_ERROR);
    }

    return factory;
  };
}

const detectIsComponentFactory = (factory: unknown): factory is ComponentFactory => factory instanceof ComponentFactory;

const getComponentFactoryKey = (factory: ComponentFactory): DarkElementKey => factory.props[ATTR_KEY] || null;

export {
  ComponentFactory,
  createComponent,
  detectIsComponentFactory,
  getComponentFactoryKey,
};
