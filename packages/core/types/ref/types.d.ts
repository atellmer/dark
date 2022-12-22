export type MutableRef<T = unknown> = {
  current: T;
};
export type FunctionRef<T = unknown> = (ref: T) => void;
export type Ref<T = unknown> = MutableRef<T> | FunctionRef<T>;
