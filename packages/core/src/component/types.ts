import type { DarkElement, RefProps, KeyProps, FlagProps } from '../shared';
import type { Component, $$inject } from './component';
import type { Ref } from '../ref';

export type ComponentOptions = Readonly<{
  displayName?: string;
  token?: Symbol;
}>;

export type ComponentInject<P = any> = Readonly<{
  token?: Symbol;
  shouldUpdate?: ShouldUpdate<P>;
}>;

export type ShouldUpdate<P> = (prevProps: P, nextProps: P) => boolean;

export type StandardComponentProps = KeyProps & RefProps & FlagProps;

export type ComponentFactory<P = any, R = any> = (props?: P, ref?: Ref<R>) => Component<P, R>;

export type ComponentFactoryWithPossiblyInject<P = any, R = any> = {
  (props?: P, ref?: Ref<R>): Component<P, R>;
  [$$inject]?: ComponentInject<P>;
};

export type CreateElement<P extends StandardComponentProps, R = any> = (props: P, ref?: Ref<R>) => DarkElement;
