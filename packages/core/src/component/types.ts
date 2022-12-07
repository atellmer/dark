import type { DarkElement, RefProps, KeyProps } from '../shared';
import type { ComponentFactory } from './component';
import type { Ref } from '../ref';

export type ComponentOptions<P extends StandardComponentProps> = Readonly<{
  displayName?: string;
  defaultProps?: Partial<P>;
  token?: Symbol;
  shouldUpdate?: ShouldUpdate<P>;
}>;

export type ShouldUpdate<P> = (props: P, nextProps: P) => boolean;

export type StandardComponentProps = KeyProps & RefProps;

export type Component<P = any, R = any> = (props?: P, ref?: Ref<R>) => ComponentFactory<P>;

export type CreateElement<P extends StandardComponentProps, R = any> = (props: P, ref?: Ref<R>) => DarkElement;
