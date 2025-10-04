import { detectIsFunction, detectIsEqual } from '../utils';
import { useCallback } from '../use-callback';
import { useUpdate } from '../use-update';
import { type Tools } from '../workloop';
import { useMemo } from '../use-memo';
import { $$scope } from '../scope';

type CreateToolsOptions<T> = {
  next: Value<T>;
  get: () => T;
  set: (x: T) => void;
  reset: (x: T) => void;
  shouldUpdate: (p: T, n: T) => boolean;
};

function createTools<T>(options: CreateToolsOptions<T>) {
  const { get, set, reset, next, shouldUpdate: $shouldUpdate } = options;
  const tools = (): Tools => {
    const prevValue = get();
    const newValue = detectIsFunction(next) ? next(prevValue) : next;
    const shouldUpdate = () => $shouldUpdate(prevValue, newValue);
    const setValue = () => set(newValue);
    const resetValue = () => reset(prevValue);

    return { shouldUpdate, setValue, resetValue };
  };

  return tools;
}

type Value<T> = T | ((prevValue: T) => T);

function useState<T = unknown>(initialValue: T | (() => T)): [T, (value: Value<T>) => void] {
  const update = useUpdate();
  const scope = useMemo(
    () => ({
      value: detectIsFunction(initialValue) ? initialValue() : initialValue,
    }),
    [],
  );
  const setState = useCallback((next: Value<T>) => {
    const $scope = $$scope();
    const isBatch = $scope.getIsBatch();
    const isForce = $scope.getIsForce();
    const getTools = createTools({
      next,
      get: () => scope.value,
      set: (x: T) => (scope.value = x),
      reset: (x: T) => (scope.value = x),
      shouldUpdate: (p: T, n: T) => isBatch || isForce || !detectIsEqual(p, n),
    });

    update({
      getTools,
      setupBatch: isBatch ? () => getTools().setValue() : undefined,
    });
  }, []);

  return [scope.value, setState];
}

export { useState };
