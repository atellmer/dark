
import { componentFiberHelper } from '../scope';
import { Hook, HookValue } from '../fiber';
import { isUndefined, isFunction } from '@helpers';
import { detectIsDepsDifferent } from '../shared';
import { Effect, EffectCleanup } from './model';


function useEffect(effect: Effect, deps?: Array<any>) {
  const fiber = componentFiberHelper.get();
  const hook = fiber.hook as Hook<HookValue<EffectCleanup>>;
  const { idx, values } = hook;
  const runEffect = () => {
    const run = () => {
      values[idx] = {
        deps,
        value: effect(),
      };
    };

    setImmediate(() => run());
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


export {
  useEffect,
};
