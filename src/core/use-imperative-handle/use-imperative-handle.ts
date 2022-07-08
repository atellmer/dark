import { useMemo } from '@core/use-memo';
import { MutableRef } from '../ref';

function useImperativeHandle<T>(ref: MutableRef<T>, createHandle: () => object, deps: Array<any>) {
  const current = useMemo(() => createHandle(), deps);

  ref.current = current;
}

export { useImperativeHandle };
