import type { DarkElementKey, DarkElementInstance } from '../shared';
import type { Ref } from '../ref';
import type { CreateElement, ComponentOptions, StandardComponentProps } from './types';
declare class ComponentFactory<P extends StandardComponentProps = any, R = any> {
  type: CreateElement<P>;
  token: Symbol;
  props: P;
  ref: Ref<R>;
  displayName: string;
  children: Array<DarkElementInstance>;
  shouldUpdate?: (props: P, nextProps: P) => boolean;
  constructor(options: ComponentFactory<P>);
}
declare function createComponent<P, R = any>(
  createElement: CreateElement<P, R>,
  options?: ComponentOptions<P>,
): (
  props?: P & import('./types').KeyProps & import('./types').RefProps<unknown>,
  ref?: Ref<R>,
) => ComponentFactory<P & import('./types').KeyProps & import('./types').RefProps<unknown>, any>;
declare const detectIsComponentFactory: (factory: unknown) => factory is ComponentFactory<any, any>;
declare const getComponentFactoryKey: (factory: ComponentFactory) => DarkElementKey;
export { ComponentFactory, createComponent, detectIsComponentFactory, getComponentFactoryKey };
