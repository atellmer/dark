import { detectIsObject, detectIsNull, detectIsFunction } from '../utils';
import { useMemo } from '../use-memo';

function detectIsMutableRef(ref: unknown): ref is MutableRef {
  if (!detectIsObject(ref) || detectIsNull(ref)) return false;
  const mutableRef = ref as MutableRef;

  for (const key in mutableRef) {
    if (key === 'current' && mutableRef.hasOwnProperty(key)) return true;
  }

  return false;
}

function applyRef<T>(ref: Ref<T>, current: T) {
  if (detectIsFunction(ref)) {
    ref(current);
  } else if (detectIsMutableRef(ref)) {
    ref.current = current;
  }
}

function useRef<T>(initialValue: T = null): MutableRef<T> {
  return useMemo(() => ({ current: initialValue }), []) as MutableRef<T>;
}

export type MutableRef<T = unknown> = { current: T };

export type FunctionRef<T = unknown> = (ref: T) => void;

export type Ref<T = unknown> = MutableRef<T> | FunctionRef<T>;

export { detectIsMutableRef, applyRef, useRef };
