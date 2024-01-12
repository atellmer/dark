import { useCallback } from '../use-callback';
import { detectIsFunction } from '../utils';
import { useUpdate } from '../use-update';
import { type Tools } from '../workloop';
import { useMemo } from '../use-memo';
import { $$scope } from '../scope';
import { trueFn } from '../utils';

type CreateToolsOptions<T> = {
  next: Value<T>;
  get: () => T;
  set: (x: T) => void;
  reset: (x: T) => void;
  shouldUpdate?: (p: T, n: T) => boolean;
};

function createTools<T>(options: CreateToolsOptions<T>) {
  const { get, set, reset, next, shouldUpdate: $shouldUpdate = trueFn } = options;
  const $scope = $$scope();
  const isBatch = $scope.getIsBatchZone();
  const tools = (): Tools => {
    const prevValue = get();
    const newValue = detectIsFunction(next) ? next(prevValue) : next;
    const shouldUpdate = () => isBatch || $shouldUpdate(prevValue, newValue);
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
    const tools = createTools({
      next,
      get: () => scope.value,
      set: (x: T) => (scope.value = x),
      reset: (x: T) => (scope.value = x),
      shouldUpdate: (p: T, n: T) => !Object.is(p, n),
    });

    update(tools);
  }, []);

  return [scope.value, setState];
}

export { createTools, useState };
