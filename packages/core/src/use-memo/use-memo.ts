import { type VirtualNodeFactory, detectIsVirtualNodeFactory } from '../view';
import { type Component, detectIsComponent, component } from '../component';
import { __useCursor as useCursor } from '../internal';
import { type Hook, type HookValue } from '../fiber';
import { detectAreDepsDifferent } from '../utils';
import { memo } from '../memo';

type GetMemoValue = () => Component | VirtualNodeFactory;

type MemoProps = {
  deps: Array<any>;
  getValue: GetMemoValue;
};

const Memo = memo(
  component<MemoProps>(({ getValue }) => getValue()),
  (p, n) => detectAreDepsDifferent(p.deps, n.deps),
);

function detectIsElement<T>(value: T) {
  return detectIsComponent(value) || detectIsVirtualNodeFactory(value);
}

function useMemo<T>(getValue: () => T, deps: Array<any>): T {
  const cursor = useCursor();
  const { hook } = cursor;
  !hook.values && (hook.values = []); // !
  const { idx, values } = hook as Hook<HookValue<T>>;
  const state =
    values[idx] ||
    (values[idx] = {
      deps,
      value: getValue(),
    });
  let value: T = null;
  let $value: T = null;

  if (detectIsElement(state.value)) {
    value = state.value;
    $value = Memo({ getValue: getValue as GetMemoValue, deps }) as unknown as T;
  } else {
    value = detectAreDepsDifferent(state.deps, deps) ? getValue() : state.value;
    $value = value;
  }

  state.deps = deps;
  state.value = value;
  hook.idx++;

  return $value;
}

export { useMemo };
