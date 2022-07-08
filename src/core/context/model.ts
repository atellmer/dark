import { Component, SlotProps } from '../component/model';
import { DarkElement } from '../shared/model';

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
  subscribers: Array<(value: T) => void>;
};
