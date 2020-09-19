import { Component } from '@core/component/model';


export type ContexProviderProps<T> = {
  value: T;
};

export type Context<T = unknown> = {
  Provider: Component<ContexProviderProps<T>>;
  Consumer: Component<any>;
  displayName?: string;
  defaultValue: T;
};

export type ContextProviderValue<T = unknown> = {
  value: T;
  subscribers: Array<(value: T) => void>;
};
