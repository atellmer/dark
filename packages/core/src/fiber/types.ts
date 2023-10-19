import { type Fiber } from './fiber';

export enum EffectTag {
  C = 'C',
  U = 'U',
  D = 'D',
  S = 'S',
}

export type NativeElement = unknown;

export type HookValue<T = any> = {
  deps: Array<any>;
  value: T;
};

export type Hook<T = any> = {
  idx: number;
  values: Array<T>;
  self: Fiber;
};
