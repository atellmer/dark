import { useMemo } from '../use-memo';
import type { MutableRef } from '../ref/model';

function useRef<T>(initialValue: T = null): MutableRef<T> {
  const ref = useMemo(() => ({ current: initialValue }), []) as MutableRef<T>;

  return ref;
}

export { useRef };
