import { useState } from '../use-state';
import { startTransition } from '../start-transition';
import { useMemo } from '../use-memo';

function useDeferredValue<T>(value: T): T {
  const [deferredValue, setDeferredValue] = useState(value);
  const scope = useMemo(() => ({ value }), []);

  if (scope.value !== value) {
    scope.value = value;
    startTransition(() => setDeferredValue(value));
  }

  return deferredValue;
}

export { useDeferredValue };
