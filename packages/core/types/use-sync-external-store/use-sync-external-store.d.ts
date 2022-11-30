declare type Subscribe = (cb: () => void) => Unsubscribe;
declare type Unsubscribe = () => void;
declare function useSyncExternalStore<T>(subscribe: Subscribe, getSnapshot: () => T): T;
export { useSyncExternalStore };
