import { createEffect, EffectType } from '../use-effect';

const $$useLayoutEffect = Symbol('use-layout-effect');
const {
  useEffect: useLayoutEffect,
  hasEffects: hasLayoutEffects,
  dropEffects: dropLayoutEffects,
} = createEffect($$useLayoutEffect, EffectType.LAYOUT);

export { useLayoutEffect, hasLayoutEffects, dropLayoutEffects };
