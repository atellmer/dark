declare const useInsertionEffect: (effect: import('../use-effect/types').Effect, deps?: any[]) => void,
  hasInsertionEffects: (fiber: import('../fiber/fiber').Fiber<unknown>) => boolean,
  dropInsertionEffects: (
    hook: import('..').Hook<import('..').HookValue<import('../use-effect/types').DropEffect>>,
  ) => void;
export { useInsertionEffect, hasInsertionEffects, dropInsertionEffects };
