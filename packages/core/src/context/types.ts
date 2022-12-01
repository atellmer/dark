import type { Component, SlotProps } from '../component';
import type { DarkElement, Subscribe, SubscriberWithValue } from '../shared';

export type ContexProviderProps<T> = {
  value: T;
} & SlotProps;

export type Context<T = unknown> = {
  Provider: Component<ContexProviderProps<T>>;
  Consumer: Component<SlotProps<(value: T) => DarkElement>>;
  displayName?: string;
  defaultValue: T;
};

export type ContextProviderValue<T = unknown> = {
  value: T;
  subscribers: Set<(value: T) => void>;
  subscribe: Subscribe<SubscriberWithValue<T>>;
};
