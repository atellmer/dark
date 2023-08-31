import { type ScheduleCallbackOptions } from '../platform';
import { detectIsFunction } from '../helpers';
import { useUpdate } from '../use-update';
import { useMemo } from '../use-memo';
import { useCallback } from '../use-callback';
import { isTransitionZone, cancelsStore } from '../scope';

type Value<T> = T | ((prevValue: T) => T);

function useState<T = unknown>(
  initialValue: T | (() => T),
  options?: ScheduleCallbackOptions,
): [T, (value: Value<T>) => void] {
  const update = useUpdate(options);
  const scope = useMemo(
    () => ({
      value: detectIsFunction(initialValue) ? initialValue() : initialValue,
    }),
    [],
  );

  const setState = useCallback((sourceValue: Value<T>) => {
    const prevValue = scope.value;
    const newValue = detectIsFunction(sourceValue) ? sourceValue(prevValue) : sourceValue;
    const isTransition = isTransitionZone.get();
    const setValue = () => (scope.value = newValue);
    const resetValue = () => (scope.value = prevValue);

    if (!Object.is(prevValue, newValue)) {
      isTransition && cancelsStore.add(resetValue);
      setValue();
      update(setValue);
    }
  }, []);

  return [scope.value, setState];
}

export { useState };
