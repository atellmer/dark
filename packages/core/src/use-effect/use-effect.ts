import { detectIsUndefined, detectIsFunction } from '../helpers';
import { componentFiberHelper, effectsHelper } from '../scope';
import type { Hook, HookValue } from '../fiber';
import { detectIsDepsDifferent } from '../shared';
import type { Effect, EffectCleanup } from './model';

const $$useEffect = Symbol('use-effect');

function useEffect(effect: Effect, deps?: Array<any>) {
  const fiber = componentFiberHelper.get();
  const hook = fiber.hook as Hook<HookValue<EffectCleanup>>;
  const { idx, values } = hook;
  const runEffect = () => {
    const run = () => {
      values[idx] = {
        deps,
        value: effect(),
        token: $$useEffect,
      };
    };

    effectsHelper.add(() => setTimeout(run));
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

function runEffectCleanup(hook: Hook<HookValue<EffectCleanup>>) {
  const { values } = hook;

  for (const hookValue of values) {
    if (hookValue.token === $$useEffect) {
      const cleanup = hookValue.value;

      detectIsFunction(cleanup) && cleanup();
    }
  }
}

export { useEffect, runEffectCleanup };
