export declare type MutableRef<T = unknown> = {
  current: T;
};
export declare type FunctionRef<T = unknown> = (ref: T) => void;
export declare type Ref<T = unknown> = MutableRef<T> | FunctionRef<T>;
