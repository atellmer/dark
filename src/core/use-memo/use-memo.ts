import { createComponent, detectIsComponentFactory, ComponentFactory } from '@core/component';
import { detectIsTagVirtualNode } from '@core/view';
import { currentHookHelper } from '@core/scope';
import { isUndefined, isArray, error } from '@helpers';
import { detectIsDepsDifferent } from '../shared';


const $$memo = Symbol('memo');

const Memo = createComponent(({ slot }) => slot, { token: $$memo });

function wrap(value: any, isDepsDifferent: boolean) {
  if (detectIsTagVirtualNode(value) || detectIsComponentFactory(value)) {
    return Memo({
      [$$memo]: () => isDepsDifferent,
      slot: value,
    });
  }

  return value;
}

function processValue(fn: () => any, isDepsDifferent: boolean) {
  let value = fn();

  if (isArray(value)) {
    value = value.map(x => wrap(x, isDepsDifferent));
  } else {
    value = wrap(value, isDepsDifferent);
  }

  return value;
}

function useMemo(fn: () => any, deps: Array<any> = []) {
  const hook = currentHookHelper.get();
  const { idx, values } = hook;

  if (isUndefined(values[idx])) {
    const value = processValue(fn, false);

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
  } else {
    hookValue.value = processValue(fn, false);
  }

  hook.idx++;

  return hookValue.value;
}

const detectIsMemo = (o: any) => detectIsComponentFactory(o) && o.token === $$memo;

const detectNeedUpdateMemo = (factory: ComponentFactory): boolean => factory.props[$$memo]();

export {
  useMemo,
  detectIsMemo,
  detectNeedUpdateMemo,
};
