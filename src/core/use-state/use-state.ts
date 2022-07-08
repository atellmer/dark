import { getRootId, effectStoreHelper, componentFiberHelper } from '@core/scope';
import { useUpdate } from '@core/use-update';
import { useMemo } from '@core/use-memo';
import { useCallback } from '@core/use-callback';
import { isUndefined, isFunction } from '@helpers';

type Value<T> = T | ((prevValue: T) => T);
type Scope = {
  idx: number;
  values: Array<any>;
  update: () => void;
};

function useState<T = unknown>(initialValue: T): [T, (value: Value<T>) => void] {
  const rootId = getRootId();
  const fiber = componentFiberHelper.get();
  const [update] = useUpdate();
  const scope: Scope = useMemo(
    () => ({
      idx: fiber.hook.idx,
      values: fiber.hook.values,
      update,
    }),
    [],
  );
  const setState = useCallback((sourceValue: Value<T>) => {
    effectStoreHelper.set(rootId);
    const value = scope.values[scope.idx];
    const newValue = isFunction(sourceValue) ? sourceValue(value) : sourceValue;

    if (!Object.is(value, newValue)) {
      scope.values[scope.idx] = newValue; // important order
      scope.update();
    }
  }, []);
  const { hook } = fiber;
  const { idx, values } = hook;
  const value: T = !isUndefined(values[idx]) ? values[idx] : initialValue;

  values[idx] = value;
  scope.idx = idx;
  scope.update = update;
  scope.values = values;
  hook.idx++;

  return [value, setState];
}

export { useState };
