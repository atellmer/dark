import type { Component } from '../component';
import type { DarkElement, Subscribe, SubscriberWithValue, SlotProps } from '../shared';
export declare type ContexProviderProps<T> = {
  value: T;
} & SlotProps;
export declare type Context<T = unknown> = {
  Provider: Component<ContexProviderProps<T>>;
  Consumer: Component<SlotProps<(value: T) => DarkElement>>;
  displayName?: string;
  defaultValue: T;
};
export declare type ContextProviderValue<T = unknown> = {
  value: T;
  subscribers: Set<(value: T) => void>;
  subscribe: Subscribe<SubscriberWithValue<T>>;
};
