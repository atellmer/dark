import type { DarkElement, RefProps, KeyProps, FlagProps } from '../shared';
import type { ComponentFactory } from './component';
import type { Ref } from '../ref';
export declare type ComponentOptions<P extends StandardComponentProps> = Readonly<{
  displayName?: string;
  defaultProps?: Partial<P>;
  token?: Symbol;
  shouldUpdate?: ShouldUpdate<P>;
}>;
export declare type ShouldUpdate<P> = (props: P, nextProps: P) => boolean;
export declare type StandardComponentProps = KeyProps & RefProps & FlagProps;
export declare type Component<P = any, R = any> = (props?: P, ref?: Ref<R>) => ComponentFactory<P>;
export declare type CreateElement<P extends StandardComponentProps, R = any> = (props: P, ref?: Ref<R>) => DarkElement;
