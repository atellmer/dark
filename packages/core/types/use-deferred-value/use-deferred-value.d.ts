type UseDeferredValueOprions = {
  timeoutMs: number;
};
declare function useDeferredValue<T>(value: T, options?: UseDeferredValueOprions): T;
export { useDeferredValue };
