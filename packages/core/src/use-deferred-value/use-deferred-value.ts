import { detectIsNumber } from '../helpers';
import { useState } from '../use-state';
import { useEffect } from '../use-effect';
import { TaskPriority } from '../constants';

type UseDeferredValueOprions = {
  timeoutMs: number;
};

function useDeferredValue<T>(value: T, options?: UseDeferredValueOprions): T {
  const { timeoutMs } = options || {};
  const [deferredValue, setDeferredValue] = useState(value, TaskPriority.LOW);

  useEffect(() => {
    let timerId = null;

    if (detectIsNumber(timeoutMs)) {
      timerId = setTimeout(() => {
        setDeferredValue(value);
      }, timeoutMs);
    } else {
      setDeferredValue(value);
    }

    return () => timerId && clearTimeout(timerId);
  }, [value]);

  return deferredValue;
}

export { useDeferredValue };
