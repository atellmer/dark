import { useMemo, useUpdate, useEffect, Callback } from '@dark-engine/core';
import { AbstractSignal } from '../abstract-signal';
import { useSignalEffect } from '@dark-engine/signals/use-signal-effect';

type Scope<T> = {
  map: Map<T, Callback>;
  prevKey: T;
};

export type Selector<T> = {
  get: () => T;
  map: Scope<T>['map'];
};

function useSelector<T>(signal$: AbstractSignal<T>): Selector<T> {
  const scope = useMemo<Scope<T>>(() => ({ map: new Map(), prevKey: undefined }), []);
  const { map } = scope;
  const get = () => signal$.peek();

  useSignalEffect(() => {
    const nextKey = signal$.get();
    const prevFn = map.get(scope.prevKey);
    const nextFn = map.get(nextKey);

    prevFn?.();
    nextFn?.();
    scope.prevKey = nextKey;
  });

  return { map, get };
}

function useSelectorValue<T>(selector: Selector<T>, key: T): T {
  const { map, get } = selector;
  const update = useUpdate();

  useEffect(() => {
    map.set(key, update);
    return () => map.delete(key);
  }, [key]);

  return get();
}

export { useSelector, useSelectorValue };
