import { useState } from '../use-state';
import { startTransition } from '../start-transition';
import { useLayoutEffect } from '../use-layout-effect';

function useDeferredValue<T>(value: T): T {
  const [deferredValue, setDeferredValue] = useState(value);

  useLayoutEffect(() => {
    startTransition(() => setDeferredValue(value));
  }, [value]);

  return deferredValue;
}

export { useDeferredValue };
