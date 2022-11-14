import { layoutEffectsHelper } from '../scope';
import { createEffectFunctions } from '../use-effect';

const $$useLayoutEffect = Symbol('use-layout-effect');

const {
  useEffect: useLayoutEffect,
  hasEffects: hasLayoutEffects,
  cleanupEffects: cleanupLayoutEffects,
} = createEffectFunctions($$useLayoutEffect, layoutEffectsHelper);

export { useLayoutEffect, hasLayoutEffects, cleanupLayoutEffects };
