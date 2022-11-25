declare const useLayoutEffect: (effect: import('../use-effect/types').Effect, deps?: any[]) => void,
  hasLayoutEffects: (fiber: import('../fiber/fiber').Fiber<unknown>) => boolean,
  dropLayoutEffects: (
    hook: import('..').Hook<import('..').HookValue<import('../use-effect/types').DropEffect>>,
  ) => void;
export { useLayoutEffect, hasLayoutEffects, dropLayoutEffects };
