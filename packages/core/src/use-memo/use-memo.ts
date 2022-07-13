import { detectIsUndefined, detectIsArray } from '../helpers';
import { detectIsComponentFactory, createComponent } from '../component';
import { detectIsTagVirtualNode } from '../view';
import { componentFiberHelper } from '../scope';
import { detectIsDepsDifferent } from '../shared';
import { $$memo } from '../memo';

const Memo = createComponent(({ slot }) => slot, { token: $$memo });

function wrap(value: unknown, isDepsDifferent: boolean) {
  if (detectIsTagVirtualNode(value) || detectIsComponentFactory(value)) {
    const factory = Memo({ slot: value });

    factory.shouldUpdate = () => isDepsDifferent;

    return factory;
  }

  return value;
}

function processValue(getValue: () => any, isDepsDifferent = false) {
  let value = getValue();

  if (detectIsArray(value)) {
    value = value.map(x => wrap(x, isDepsDifferent));
  } else {
    value = wrap(value, isDepsDifferent);
  }

  return value;
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

    return value;
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
