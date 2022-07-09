import { useMemo } from '@dark/core/use-memo';
import type { MutableRef } from '@dark/core/ref/model';

function useRef<T>(initialValue: T = null): MutableRef<T> {
  const ref = useMemo(() => ({ current: initialValue }), []) as MutableRef<T>;

  return ref;
}

export { useRef };
