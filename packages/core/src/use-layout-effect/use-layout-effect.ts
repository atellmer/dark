import { createEffect, EffectType } from '../use-effect';

const $$useLayoutEffect = Symbol('use-layout-effect');
const { useEffect: useLayoutEffect, dropEffects: dropLayoutEffects } = createEffect(
  $$useLayoutEffect,
  EffectType.LAYOUT,
);

export { useLayoutEffect, dropLayoutEffects };
