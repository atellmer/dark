import { createEffect, EffectType } from '../use-effect';

const $$useInsertionEffect = Symbol('use-insertion-effect');
const { useEffect: useInsertionEffect, dropEffects: dropInsertionEffects } = createEffect(
  $$useInsertionEffect,
  EffectType.INSERTION,
);

export { useInsertionEffect, dropInsertionEffects };
