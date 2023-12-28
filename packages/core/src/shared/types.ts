import type { ComponentFactory, Component } from '../component';
import type { VirtualNode, VirtualNodeFactory } from '../view';
import { type Ref } from '../ref';
import { FLAGS } from '../constants';

export type DarkElement = NestedArray<Component | VirtualNode | RenderProps | Nullable | string | number>;

export type Nullable = null | false | undefined;

export type NestedArray<T> = T | Array<NestedArray<T>>;

export type RenderProps = (...args: Array<any>) => DarkElement;

export type ElementKey = string | number;

export type Instance = VirtualNode | VirtualNodeFactory | Component | ComponentFactory | Nullable;

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

export type FlagProps = Partial<Record<keyof typeof FLAGS, boolean>>;

export type Callback = () => void;

export type TimerId = number | NodeJS.Timeout;

export type AppStateItem<T = unknown> = [T, string];

export type AppState = Map<string, AppStateItem>;
