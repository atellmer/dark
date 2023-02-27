import type { DarkElement, SlotProps } from '../shared';
import { detectIsUndefined, detectIsArray, detectIsDepsDifferent } from '../helpers';
import { detectIsComponent, createComponent } from '../component';
import { detectIsVirtualNodeFactory } from '../view';
import { currentFiberStore } from '../scope';
import { Fragment } from '../fragment';
import { $$memo } from '../memo';

type MemoProps = Required<SlotProps>;

const Memo = createComponent<MemoProps>(({ slot }) => slot, { token: $$memo });

function wrap<T>(value: T, isDepsDifferent: boolean) {
  const check = (value: T) => detectIsVirtualNodeFactory(value) || detectIsComponent(value);

  if (detectIsArray(value) ? check(value[0]) : check(value)) {
    const slot = value as unknown as DarkElement;
    const factory = Memo({
      slot: Fragment({ slot }),
    });

    factory.shouldUpdate = () => isDepsDifferent;

    return factory;
  }

  return value;
}

function processValue<T>(getValue: () => T, isDepsDifferent = false) {
  return wrap(getValue(), isDepsDifferent);
}

function useMemo<T>(getValue: () => T, deps: Array<any>): T {
  const fiber = currentFiberStore.get();
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
