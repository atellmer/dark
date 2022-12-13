import { useState } from '../use-state';
import { useMemo } from '../use-memo';
import { TaskPriority } from '../constants';

type UseDeferredValueOprions = {
  timeoutMs: number;
};

function useDeferredValue<T>(value: T, options?: UseDeferredValueOprions): T {
  const { timeoutMs } = options || {};
  const [deferredValue, setDeferredValue] = useState(value, {
    priority: TaskPriority.LOW,
    timeoutMs,
  });
  const scope = useMemo(() => ({ value }), []);

  if (scope.value !== value && value !== deferredValue) {
    scope.value = value;
    setDeferredValue(value);
  }

  return deferredValue;
}

export { useDeferredValue };
