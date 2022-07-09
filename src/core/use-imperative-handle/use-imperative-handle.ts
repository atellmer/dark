import { useMemo } from '@dark/core/use-memo';
import type { MutableRef } from '@dark/core/ref';

function useImperativeHandle<T>(ref: MutableRef<T>, createHandle: () => object, deps: Array<any>) {
  const current = useMemo(() => createHandle(), deps);

  ref.current = current;
}

export { useImperativeHandle };
