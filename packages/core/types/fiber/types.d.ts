export declare enum EffectTag {
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
export declare const cloneTagMap: {
  CREATE: boolean;
  SKIP: boolean;
};
