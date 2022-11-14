import { detectIsUndefined, detectIsFunction, detectIsDepsDifferent } from '../helpers';
import { componentFiberHelper, effectsHelper } from '../scope';
import type { Fiber, Hook, HookValue } from '../fiber';
import type { Effect, EffectCleanup } from './model';

const $$useEffect = Symbol('use-effect');

function useEffect(effect: Effect, deps?: Array<any>) {
  const fiber = componentFiberHelper.get();
  const hook = fiber.hook as Hook<HookValue<EffectCleanup>>;
  const { idx, values } = hook;
  const runEffect = () => {
    values[idx] = {
      deps,
      value: undefined,
      token: $$useEffect,
    };

    effectsHelper.add(() => {
      values[idx].value = effect();
    });
  };

  if (detectIsUndefined(values[idx])) {
    runEffect();
  } else {
    const { deps: prevDeps, value: cleanup } = values[idx];
    const isDepsDifferent = deps ? detectIsDepsDifferent(deps, prevDeps) : true;

    if (isDepsDifferent) {
      detectIsFunction(cleanup) && cleanup();
      runEffect();
    }
  }

  hook.idx++;
}

function hasEffects(fiber: Fiber) {
  const { values } = fiber.hook as Hook<HookValue>;
  const hasEffect = values.some(x => x.token === $$useEffect);

  return hasEffect;
}

function cleanupEffects(hook: Hook<HookValue<EffectCleanup>>) {
  const { values } = hook;

  for (const value of values) {
    if (value.token === $$useEffect) {
      const cleanup = value.value;

      detectIsFunction(cleanup) && cleanup();
    }
  }
}

export { useEffect, hasEffects, cleanupEffects };
