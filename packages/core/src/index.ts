/* eslint-disable @typescript-eslint/no-namespace */
export * from './component';
export { createContext, useContext } from './context';
export { h } from './element';
export * from './fiber';
export * from './use-atom';
export { Fragment } from './fragment';
export * from './platform';
export * from './helpers';
export { lazy } from './lazy';
export { memo } from './memo';
export * from './ref';
export * from './scope';
export * from './shared';
export { VERSION } from './constants';
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
export { useRef } from './use-ref';
export { useUpdate } from './use-update';
export { useState } from './use-state';
export { useReactiveState } from './use-reactive-state';
export { useId } from './use-id';
export { useSyncExternalStore } from './use-sync-external-store';
export { useSpring, type Animation } from './use-spring';
export { walkFiber } from './walk';
export { unmountRoot } from './unmount';
export { batch } from './batch';
export { hot } from './hot';
export * from './view';
export * from './constants';

declare global {
  namespace JSX {
    interface ElementChildrenAttribute {
      slot: {};
    }
  }
}
