import { detectIsFunction } from '../helpers';
import { type UseUpdateOptions, useUpdate } from '../use-update';
import { useMemo } from '../use-memo';
import { useCallback } from '../use-callback';
import { scope$$ } from '../scope';

type Value<T> = T | ((prevValue: T) => T);

function useState<T = unknown>(
  initialValue: T | (() => T),
  options?: UseUpdateOptions,
): [T, (value: Value<T>) => void] {
  const update = useUpdate(options);
  const scope = useMemo(
    () => ({
      value: detectIsFunction(initialValue) ? initialValue() : initialValue,
    }),
    [],
  );
  const setState = useCallback((sourceValue: Value<T>) => {
    const scope$ = scope$$();
    const isTransition = scope$.getIsTransitionZone();
    const shouldUpdate = () => {
      const prevValue = scope.value;
      const newValue = detectIsFunction(sourceValue) ? sourceValue(prevValue) : sourceValue;
      const shouldUpdate = !Object.is(prevValue, newValue);
      const resetValue = () => (scope.value = prevValue);

      if (shouldUpdate) {
        scope.value = newValue;
        isTransition && scope$.addCancel(resetValue);
      }

      return shouldUpdate;
    };

    update(shouldUpdate);
  }, []);

  return [scope.value, setState];
}

export { useState };
