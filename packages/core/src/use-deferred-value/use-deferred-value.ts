import { useState } from '../use-state';
import { startTransition } from '../start-transition';
import { useEffect } from '../use-effect';

type UseDeferredValueOptions = {
  timeoutMs?: number;
};

function useDeferredValue<T>(value: T, options?: UseDeferredValueOptions): T {
  const [deferredValue, setDeferredValue] = useState(value);

  useEffect(() => {
    startTransition(() => setDeferredValue(value));
  }, [value]);

  return deferredValue;
}

export { useDeferredValue };
