import { type ScheduleCallbackOptions } from '../platform';
import { detectIsUndefined, detectIsFunction } from '../helpers';
import { currentFiberStore } from '../scope';
import { useUpdate } from '../use-update';
import { useMemo } from '../use-memo';
import { useCallback } from '../use-callback';
import { TaskPriority } from '../constants';

type Value<T> = T | ((prevValue: T) => T);
type Scope = {
  idx: number;
  values: Array<any>;
};

function useState<T = unknown>(initialValue: T, options?: ScheduleCallbackOptions): [T, (value: Value<T>) => void] {
  const fiber = currentFiberStore.get();
  const update = useUpdate(options);
  const scope: Scope = useMemo(
    () => ({
      idx: fiber.hook.idx,
      values: fiber.hook.values,
    }),
    [],
  );
  const setState = useCallback((sourceValue: Value<T>) => {
    const value = scope.values[scope.idx];
    const newValue = detectIsFunction(sourceValue) ? sourceValue(value) : sourceValue;

    if (!Object.is(value, newValue)) {
      const setValue = () => {
        scope.values[scope.idx] = newValue;
      };

      if (options?.priority === TaskPriority.LOW) {
        update(() => setValue());
      } else {
        setValue();
        update();
      }
    }
  }, []);
  const { hook } = fiber;
  const { idx, values } = hook;
  const value: T = !detectIsUndefined(values[idx]) ? values[idx] : initialValue;

  values[idx] = value;
  scope.idx = idx;
  scope.values = values;
  hook.idx++;

  return [value, setState];
}

export { useState };
