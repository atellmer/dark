import { createEffect, EffectType } from '../use-effect';

const useInsertionEffect = createEffect(EffectType.INSERTION);

export { useInsertionEffect };
