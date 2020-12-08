export enum EffectTag {
  PLACEMENT = 'PLACEMENT',
  UPDATE = 'UPDATE',
  DELETION = 'DELETION',
  SKIP = 'SKIP',
};

export type NativeElement = unknown;

export type HookValue<T = any> = {
  token?: Symbol;
  deps: Array<any>;
  value: T;
};

export type Hook<T = any> = {
  idx: number;
  values: Array<T>;
};

export const cloneTagMap = {
  [EffectTag.PLACEMENT]: true,
  [EffectTag.SKIP]: true,
};
