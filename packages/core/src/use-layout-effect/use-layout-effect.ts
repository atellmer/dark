import { createEffect, EffectType } from '../use-effect';

const useLayoutEffect = createEffect(EffectType.LAYOUT);

export { useLayoutEffect };
