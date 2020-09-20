
import { componentFiberHelper } from '../scope';
import { Hook, HookValue } from '../fiber';
import { isUndefined, isFunction } from '@helpers';
import { detectIsDepsDifferent } from '../shared';
import { Effect, EffectCleanup } from './model';


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

    setImmediate(run);
  };

  if (isUndefined(values[idx])) {
    runEffect();
  } else {
    const {
      deps: prevDeps,
      value: cleanup,
    } = values[idx];
    const isDepsDifferent = deps ? detectIsDepsDifferent(deps, prevDeps) : true;

    if (isDepsDifferent) {
      isFunction(cleanup) && cleanup();
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

      isFunction(cleanup) && cleanup();
    }
  }
}

export {
  useEffect,
  runEffectCleanup,
};
