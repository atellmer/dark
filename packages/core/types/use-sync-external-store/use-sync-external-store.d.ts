import type { Subscribe, Subscriber } from '../shared';
declare function useSyncExternalStore<T>(subscribe: Subscribe<Subscriber>, getSnapshot: () => T): T;
export { useSyncExternalStore };
