import type { DarkElement, SlotProps } from '../shared';
import { detectIsUndefined, detectIsArray, detectAreDepsDifferent } from '../helpers';
import { detectIsComponent, component } from '../component';
import { detectIsVirtualNodeFactory } from '../view';
import { currentFiberStore } from '../scope';
import { Fragment } from '../fragment';
import { $$memo } from '../memo';

type MemoProps = Required<SlotProps>;

const Memo = component<MemoProps>(({ slot }) => slot, { token: $$memo });

function check<T>(value: T) {
  return detectIsVirtualNodeFactory(value) || detectIsComponent(value);
}

function wrap<T>(value: T, isDifferent: boolean) {
  if (detectIsArray(value) ? check(value[0]) : check(value)) {
    const component = Memo({
      slot: Fragment({ slot: value as unknown as DarkElement }),
    });

    component.su = () => isDifferent;

    return component;
  }

  return value;
}

function processValue<T>(getValue: () => T, isDifferent = false) {
  return wrap(getValue(), isDifferent);
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
  const isDifferent = detectAreDepsDifferent(deps, hookValue.deps as Array<any>);
  const getValue$ = isDifferent ? getValue : () => hookValue.value;

  hookValue.deps = deps;
  hookValue.value = processValue(getValue$, isDifferent);
  hook.idx++;

  return hookValue.value;
}

export { useMemo };
