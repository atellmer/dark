import { detectIsComponentFactory } from '@core/component';
import { detectIsTagVirtualNode } from '@core/view';
import { componentFiberHelper } from '@core/scope';
import { isUndefined, isArray } from '@helpers';
import { detectIsDepsDifferent } from '../shared';
import { $$memo, Memoize } from '../memo';


function wrap(value: any, isDepsDifferent: boolean) {
  if (detectIsTagVirtualNode(value) || detectIsComponentFactory(value)) {
    return Memoize({
      [$$memo]: () => isDepsDifferent,
      slot: value,
    });
  }

  return value;
}

function processValue(fn: () => any, isDepsDifferent: boolean = false) {
  let value = fn();

  if (isArray(value)) {
    value = value.map(x => wrap(x, isDepsDifferent));
  } else {
    value = wrap(value, isDepsDifferent);
  }

  return value;
}

function useMemo(fn: () => any, deps: Array<any>) {
  const fiber = componentFiberHelper.get();
  const  { hook } = fiber
  const { idx, values } = hook;

  if (isUndefined(values[idx])) {
    const value = processValue(fn);

    values[idx] = {
      deps,
      value,
    };

    hook.idx++;

    return value;
  }

  const hookValue = values[idx];
  const prevDeps = hookValue.deps as Array<any>;
  const isDepsDifferent = detectIsDepsDifferent(deps, prevDeps);

  if (isDepsDifferent) {
    hookValue.deps = deps;
    hookValue.value = processValue(fn, true);
  }

  hook.idx++;

  return hookValue.value;
}

export {
  useMemo,
};
