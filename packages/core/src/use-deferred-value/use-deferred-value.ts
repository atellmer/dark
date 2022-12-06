import { useState } from '../use-state';
import { TaskPriority } from '../constants';
import { batch } from '../batch';

type UseDeferredValueOprions = {
  timeoutMs: number;
};

function useDeferredValue<T>(value: T, options?: UseDeferredValueOprions): T {
  const { timeoutMs } = options || {};
  const [deferredValue, setDeferredValue] = useState(value, {
    priority: TaskPriority.LOW,
    timeoutMs,
  });

  if (value !== deferredValue) {
    batch(() => {
      setDeferredValue(value);
    });
  }

  return deferredValue;
}

export { useDeferredValue };
