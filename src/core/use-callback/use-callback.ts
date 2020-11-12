import { componentFiberHelper } from '@core/scope';
import { isUndefined } from '@helpers';
import { detectIsDepsDifferent } from '../shared';

function useCallback(callback: Function, deps: Array<any>): Function {
  const fiber = componentFiberHelper.get();
  const { hook } = fiber;
  const { idx, values } = hook;

  if (isUndefined(values[idx])) {
    values[idx] = {
      deps,
      value: callback,
    };

    hook.idx++;

    return callback;
  }

  const hookValue = values[idx];
  const prevDeps = hookValue.deps as Array<any>;
  const isDepsDifferent = detectIsDepsDifferent(deps, prevDeps);

  if (isDepsDifferent) {
    hookValue.deps = deps;
    hookValue.value = callback;
  }

  hook.idx++;

  return hookValue.value;
}

export {
  useCallback,
};
