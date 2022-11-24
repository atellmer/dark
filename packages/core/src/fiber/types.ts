export enum EffectTag {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  SKIP = 'SKIP',
}

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
  [EffectTag.CREATE]: true,
  [EffectTag.SKIP]: true,
};
