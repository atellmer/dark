import { useState } from '../use-state';
import { startTransition } from '../start-transition';
import { useMemo } from '../use-memo';

function useDeferredValue<T>(value: T): T {
  const [deferredValue, setDeferredValue] = useState(value);

  useMemo(() => {
    startTransition(() => setDeferredValue(value));
  }, [value]);

  return deferredValue;
}

export { useDeferredValue };
