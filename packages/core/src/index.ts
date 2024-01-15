/* eslint-disable @typescript-eslint/no-namespace */
export * from './component';
export * from './view';
export { createContext, useContext } from './context';
export { h } from './element';
export * from './fiber';
export * from './workloop';
export * from './atom';
export { Fragment } from './fragment';
export * from './platform';
export * from './utils';
export { lazy } from './lazy';
export { memo } from './memo';
export * from './ref';
export * from './scope';
export * from './shared';
export * from './scheduler';
export { VERSION } from './constants';
export { Guard } from './guard';
export { Suspense } from './suspense';
export { useCallback } from './use-callback';
export { useDeferredValue } from './use-deferred-value';
export { useEffect } from './use-effect';
export { useLayoutEffect } from './use-layout-effect';
export { useInsertionEffect } from './use-insertion-effect';
export { useError } from './use-error';
export { useEvent } from './use-event';
export { useImperativeHandle } from './use-imperative-handle';
export { useMemo } from './use-memo';
export { useReducer } from './use-reducer';
export { useUpdate } from './use-update';
export { useState } from './use-state';
export { useId } from './use-id';
export { useSyncExternalStore } from './use-sync-external-store';
export { type CacheRecord, InMemoryCache, CacheProvider, useCache } from './cache';
export { useResource } from './use-resource';
export * from './use-mutation';
export * from './walk';
export { unmountRoot } from './unmount';
export { batch } from './batch';
export { hot } from './hot';
export * from './emitter';
export * from './start-transition';
export * from './constants';

declare global {
  namespace JSX {
    interface ElementChildrenAttribute {
      slot: {};
    }
  }
}
