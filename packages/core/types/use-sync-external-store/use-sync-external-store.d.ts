declare type Sunscribe = (cb: () => void) => Unsubscribe;
declare type Unsubscribe = () => void;
declare function useSyncExternalStore<T>(subscribe: Sunscribe, getSnapshot: () => T): T;
export { useSyncExternalStore };
