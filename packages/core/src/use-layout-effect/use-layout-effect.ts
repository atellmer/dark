import { layoutEffectsStore } from '../scope';
import { createEffect } from '../use-effect';

const $$useLayoutEffect = Symbol('use-layout-effect');

const {
  useEffect: useLayoutEffect,
  hasEffects: hasLayoutEffects,
  dropEffects: dropLayoutEffects,
} = createEffect($$useLayoutEffect, layoutEffectsStore);

export { useLayoutEffect, hasLayoutEffects, dropLayoutEffects };
