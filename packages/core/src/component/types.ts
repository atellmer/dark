import type { DarkElement, RefProps, KeyProps, FlagProps } from '../shared';
import type { Component } from './component';
import type { Ref } from '../ref';

export type ComponentOptions<P extends StandardComponentProps> = Readonly<{
  displayName?: string;
  token?: Symbol;
  keepRef?: boolean;
  shouldUpdate?: ShouldUpdate<P>;
}>;

export type ShouldUpdate<P> = (props: P, nextProps: P) => boolean;

export type StandardComponentProps = KeyProps & RefProps & FlagProps;

export type ComponentFactory<P = any, R = any> = (props?: P, ref?: Ref<R>) => Component<P, R>;

export type CreateElement<P extends StandardComponentProps, R = any> = (props: P, ref?: Ref<R>) => DarkElement;
