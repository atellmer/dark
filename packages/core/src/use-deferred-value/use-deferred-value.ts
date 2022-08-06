import { useState } from '../use-state';
import { useEffect } from '../use-effect';
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

  useEffect(() => {
    setDeferredValue(value);
  }, [value]);

  return deferredValue;
}

export { useDeferredValue };
