import { useMemo } from '../use-memo';
import { type Ref, applyRef } from '../ref';

function useImperativeHandle<T>(ref: Ref<T>, createHandle: () => T, deps?: Array<any>) {
  const current = useMemo(() => createHandle(), deps || [{}]);

  ref && applyRef(ref, current);
}

export { useImperativeHandle };
