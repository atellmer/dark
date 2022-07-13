import { detectIsUndefined, detectIsFunction } from '../helpers';
import { componentFiberHelper } from '../scope';
import { useUpdate } from '../use-update';
import { useMemo } from '../use-memo';
import { useCallback } from '../use-callback';

type Value<T> = T | ((prevValue: T) => T);
type Scope = {
  idx: number;
  values: Array<any>;
  update: () => void;
};

function useState<T = unknown>(initialValue: T): [T, (value: Value<T>) => void] {
  const fiber = componentFiberHelper.get();
  const update = useUpdate();
  const scope: Scope = useMemo(
    () => ({
      idx: fiber.hook.idx,
      values: fiber.hook.values,
      update,
    }),
    [],
  );
  const setState = useCallback((sourceValue: Value<T>) => {
    const value = scope.values[scope.idx];
    const newValue = detectIsFunction(sourceValue) ? sourceValue(value) : sourceValue;

    if (!Object.is(value, newValue)) {
      scope.values[scope.idx] = newValue;
      scope.update();
    }
  }, []);
  const { hook } = fiber;
  const { idx, values } = hook;
  const value: T = !detectIsUndefined(values[idx]) ? values[idx] : initialValue;

  values[idx] = value;
  scope.idx = idx;
  scope.update = update;
  scope.values = values;
  hook.idx++;

  return [value, setState];
}

export { useState };
