import { detectIsUndefined, detectIsDepsDifferent } from '../helpers';
import { detectIsComponentFactory, createComponent } from '../component';
import { detectIsTagVirtualNode } from '../view';
import { componentFiberHelper } from '../scope';
import { $$memo } from '../memo';

const Memo = createComponent(({ slot }) => slot, { token: $$memo });

function wrap<T>(value: T, isDepsDifferent: boolean) {
  if (detectIsTagVirtualNode(value) || detectIsComponentFactory(value)) {
    const factory = Memo({ slot: value });

    factory.shouldUpdate = () => isDepsDifferent;

    return factory;
  }

  return value;
}

function processValue<T>(getValue: () => T, isDepsDifferent = false) {
  return wrap(getValue(), isDepsDifferent);
}

function useMemo<T>(getValue: () => T, deps: Array<any>): T {
  const fiber = componentFiberHelper.get();
  const { hook } = fiber;
  const { idx, values } = hook;

  if (detectIsUndefined(values[idx])) {
    const value = processValue(getValue);

    values[idx] = {
      deps,
      value,
    };

    hook.idx++;

    return value as T;
  }

  const hookValue = values[idx];
  const prevDeps = hookValue.deps as Array<any>;
  const isDepsDifferent = detectIsDepsDifferent(deps, prevDeps);
  const computedGetValue = isDepsDifferent ? getValue : () => hookValue.value;

  hookValue.deps = deps;
  hookValue.value = processValue(computedGetValue, isDepsDifferent);

  hook.idx++;

  return hookValue.value;
}

export { useMemo };
