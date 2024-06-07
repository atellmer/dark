import type { VirtualNode, VirtualNodeFactory } from '../view';
import type { Component } from '../component';
import { FLAG_ATTR } from '../constants';
import { type Ref } from '../ref';

export type DarkElement = NestedArray<Component | VirtualNode | RenderProps | Nullable | TextBased | boolean>;

export type Nullable = null | false | undefined;

export type NestedArray<T> = T | Array<NestedArray<T>>;

export type RenderProps = (...args: Array<any>) => DarkElement;

export type ElementKind = string | Function;

export type ElementKey = string | number;

export type Instance = VirtualNode | VirtualNodeFactory | Component | Nullable;

export type Subscriber = () => void;

export type SubscriberWithValue<T> = (value: T) => void;

export type Subscribe<S extends Function> = (subscriber: S) => Unsubscribe;

export type Unsubscribe = () => void;

export type SlotProps<T = DarkElement> = {
  slot: T;
};

export type RefProps<T = unknown> = {
  ref?: Ref<T>;
};

export type KeyProps = {
  key?: ElementKey;
};

export type FlagProps = {
  [FLAG_ATTR]?: number;
};

export type Callback = () => void;

export type CallbackWithValue<T> = (x: T) => void;

export type TimerId = undefined | ReturnType<typeof setTimeout>;

export type AppResource<T = unknown> = [T, string];

export type AppResources = Map<number, AppResource>;

export type TextBased = number | string;

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};
