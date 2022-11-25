export declare enum EffectTag {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  SKIP = 'SKIP',
}
export declare type NativeElement = unknown;
export declare type HookValue<T = any> = {
  token?: Symbol;
  deps: Array<any>;
  value: T;
};
export declare type Hook<T = any> = {
  idx: number;
  values: Array<T>;
};
export declare const cloneTagMap: {
  CREATE: boolean;
  SKIP: boolean;
};
