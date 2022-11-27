/* eslint-disable @typescript-eslint/no-namespace */
export * from './component';
export * from './context';
export { h } from './element';
export * from './fiber';
export * from './fragment';
export * from './platform';
export * from './helpers';
export * from './lazy';
export * from './memo';
export * from './ref';
export * from './scope';
export * from './shared';
export * from './suspense';
export * from './use-callback';
export * from './use-context';
export * from './use-deferred-value';
export { useEffect } from './use-effect';
export * from './use-error';
export * from './use-event';
export * from './use-imperative-handle';
export { useLayoutEffect } from './use-layout-effect';
export * from './use-memo';
export * from './use-reducer';
export * from './use-ref';
export * from './use-state';
export * from './use-update';
export * from './view';
export * from './constants';
export { walkFiber } from './walk';
export { unmountRoot } from './unmount';
export { batch } from './batch';

export const version = process.env.VERSION;

declare global {
  namespace JSX {
    interface ElementChildrenAttribute {
      slot: {};
    }
  }
}
