import { useMemo } from '../use-memo';
import type { MutableRef } from '../ref';

function useImperativeHandle<T>(ref: MutableRef<T>, createHandle: () => T, deps?: Array<any>) {
  const current = useMemo(() => createHandle(), deps || [{}]);

  ref.current = current;
}

export { useImperativeHandle };