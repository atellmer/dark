import type { DarkElement, SlotProps } from '../shared';
import { detectIsUndefined, detectIsArray, detectAreDepsDifferent } from '../helpers';
import { detectIsComponent, component } from '../component';
import { detectIsVirtualNodeFactory } from '../view';
import { scope$$ } from '../scope';
import { $$memo } from '../memo';
import { type Hook, type HookValue } from '../fiber';

type MemoProps = Required<SlotProps>;

const Memo = component<MemoProps>(({ slot }) => slot, { token: $$memo });

function check<T>(value: T) {
  return detectIsVirtualNodeFactory(value) || detectIsComponent(value);
}

function wrap<T>(value: T, isDifferent: boolean) {
  if (detectIsArray(value) ? check(value[0]) : check(value)) {
    const component = Memo({ slot: value as unknown as DarkElement });

    component.shouldUpdate = () => isDifferent;

    return component;
  }

  return value;
}

function processValue<T>(getValue: () => T, isDifferent = false) {
  return wrap(getValue(), isDifferent) as T;
}

function useMemo<T>(getValue: () => T, deps: Array<any>): T {
  const fiber = scope$$().getCursorFiber();
  const { hook } = fiber;
  const { idx, values } = hook as Hook<HookValue<T>>;

  if (detectIsUndefined(values[idx])) {
    const value = processValue(getValue);

    values[idx] = {
      deps,
      value,
    };

    hook.idx++;

    return value as T;
  }

  const hookValue = values[idx] as HookValue;
  const isDifferent = detectAreDepsDifferent(deps, hookValue.deps as Array<any>);
  const getValue$ = isDifferent ? getValue : () => hookValue.value;

  hookValue.deps = deps;
  hookValue.value = processValue(getValue$, isDifferent);
  hook.idx++;

  return hookValue.value;
}

export { useMemo };
