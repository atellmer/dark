import { insertionEffectsStore } from '../scope';
import { createEffect } from '../use-effect';

const $$useInsertionEffect = Symbol('use-insertion-effect');

const {
  useEffect: useInsertionEffect,
  hasEffects: hasInsertionEffects,
  dropEffects: dropInsertionEffects,
} = createEffect($$useInsertionEffect, insertionEffectsStore);

export { useInsertionEffect, hasInsertionEffects, dropInsertionEffects };
