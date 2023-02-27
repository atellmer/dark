import type { ComponentFactory, Component } from '../component';
import type { VirtualNode, VirtualNodeFactory } from '../view';
import { type Ref } from '../ref';
import { type Flag } from '../constants';

export type DarkElement = NestedArray<Component | VirtualNode | RenderProps | Nullable | string | number>;

export type Nullable = null | false | undefined;

export type NestedArray<T> = T | Array<NestedArray<T>>;

export type RenderProps = (...args: Array<any>) => DarkElement;

export type DarkElementKey = string | number;

export type DarkElementInstance = VirtualNode | VirtualNodeFactory | Component | ComponentFactory | Nullable;

export type Subscriber = () => void;

export type SubscriberWithValue<T> = (value: T) => void;

export type Subscribe<S extends Function> = (subscriber: S) => Unsubscribe;

export type Unsubscribe = () => void;

export type SlotProps<T = DarkElement> = Readonly<{
  slot: T;
}>;

export type RefProps<T = unknown> = {
  ref?: Ref<T>;
};

export type KeyProps = {
  key?: DarkElementKey;
};

export type FlagProps = {
  flag?: Record<Flag, boolean>;
};
