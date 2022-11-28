import { type ScheduleCallbackOptions } from '../platform';
import { detectIsFunction } from '../helpers';
import { useUpdate } from '../use-update';
import { useMemo } from '../use-memo';
import { useCallback } from '../use-callback';
import { TaskPriority } from '../constants';

type Value<T> = T | ((prevValue: T) => T);

function useState<T = unknown>(
  initialValue: T | (() => T),
  options?: ScheduleCallbackOptions,
): [T, (value: Value<T>) => void] {
  const update = useUpdate(options);
  const store = useMemo(
    () => ({
      value: detectIsFunction(initialValue) ? initialValue() : initialValue,
    }),
    [],
  );

  const setState = useCallback((sourceValue: Value<T>) => {
    const prevValue = store.value;
    const newValue = detectIsFunction(sourceValue) ? sourceValue(prevValue) : sourceValue;

    if (!Object.is(prevValue, newValue)) {
      const setValue = () => (store.value = newValue);

      if (options?.priority === TaskPriority.LOW) {
        update(() => setValue());
      } else {
        setValue();
        update();
      }
    }
  }, []);

  return [store.value, setState];
}

export { useState };
