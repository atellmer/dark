import { effectsStore } from '../scope';
import type { Fiber, Hook, HookValue } from '../fiber';
import type { Effect, DropEffect } from './types';
declare const useEffect: (effect: Effect, deps?: Array<any>) => void,
  hasEffects: (fiber: Fiber) => boolean,
  dropEffects: (hook: Hook<HookValue<DropEffect>>) => void;
declare function createEffect(
  token: Symbol,
  store: typeof effectsStore,
): {
  useEffect: (effect: Effect, deps?: Array<any>) => void;
  hasEffects: (fiber: Fiber) => boolean;
  dropEffects: (hook: Hook<HookValue<DropEffect>>) => void;
};
export { useEffect, hasEffects, dropEffects, createEffect };
