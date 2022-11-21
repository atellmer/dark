import { layoutEffectsHelper } from '../scope';
import { createEffect } from '../use-effect';

const $$useLayoutEffect = Symbol('use-layout-effect');

const {
  useEffect: useLayoutEffect,
  hasEffects: hasLayoutEffects,
  dropEffects: dropLayoutEffects,
} = createEffect($$useLayoutEffect, layoutEffectsHelper);

export { useLayoutEffect, hasLayoutEffects, dropLayoutEffects };
