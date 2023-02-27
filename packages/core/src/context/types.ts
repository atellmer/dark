import type { ComponentFactory } from '../component';
import type { DarkElement, Subscribe, SubscriberWithValue, SlotProps, KeyProps } from '../shared';

export type ContexProviderProps<T> = {
  value: T;
} & SlotProps &
  KeyProps;

export type Context<T = unknown> = {
  Provider: ComponentFactory<ContexProviderProps<T>>;
  Consumer: ComponentFactory<SlotProps<(value: T) => DarkElement>>;
  displayName?: string;
  defaultValue: T;
};

export type ContextProviderValue<T = unknown> = {
  value: T;
  subscribers: Set<(value: T) => void>;
  subscribe: Subscribe<SubscriberWithValue<T>>;
};
