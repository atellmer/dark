import type { DarkElement, RefProps, KeyProps, FlagProps } from '../shared';
import type { Component, $$inject } from './component';
import type { Ref } from '../ref';

export type ComponentOptions = Readonly<{
  displayName?: string;
  token?: Symbol;
}>;

export type ComponentInject<P extends object = {}> = Readonly<{
  token?: Symbol;
  shouldUpdate?: ShouldUpdate<P>;
}>;

export type ShouldUpdate<P> = (prevProps: P, nextProps: P) => boolean;

export type StandardComponentProps = KeyProps & RefProps & FlagProps;

export type ComponentFactory<P extends object = {}, R = unknown> = (props?: P, ref?: Ref<R>) => Component<P, R>;

export type ComponentFactoryWithPossiblyInject<P extends object = {}, R = unknown> = {
  (props?: P, ref?: Ref<R>): Component<P, R>;
  [$$inject]?: ComponentInject<P>;
};

export type CreateElement<P extends StandardComponentProps, R = unknown> = (props: P, ref?: Ref<R>) => DarkElement;
