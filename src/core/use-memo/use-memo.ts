import { detectIsComponentFactory, createComponent } from '@dark/core/component';
import { detectIsTagVirtualNode } from '@dark/core/view';
import { componentFiberHelper } from '@dark/core/scope';
import { detectIsUndefined, detectIsArray } from '@dark/core/internal/helpers';
import { detectIsDepsDifferent } from '@dark/core/shared';
import { $$memo } from '@dark/core/memo';

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

function useMemo(getValue: () => any, deps: Array<any>) {
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
