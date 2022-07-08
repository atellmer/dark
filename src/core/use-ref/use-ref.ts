import { useMemo } from '@core/use-memo';
import { MutableRef } from '../ref/model';

function useRef<T>(initialValue: T = null): MutableRef<T> {
  const ref = useMemo(() => ({ current: initialValue }), []) as MutableRef<T>;

  return ref;
}

export { useRef };
