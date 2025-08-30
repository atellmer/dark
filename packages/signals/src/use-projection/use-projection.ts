import { useMemo, useEffect } from '@dark-engine/core';

import { type AbstractSignal } from '../abstract-signal';
import { type Projection, projection } from '../projection';
import { type Signal } from '../signal';
import { useSignal } from '../use-signal';

function useProjection<T>(signal$: AbstractSignal<T>): Projection<T> {
  const projection$ = useMemo(() => projection(signal$), []);

  useEffect(() => {
    projection$.attach();
    return () => projection$.detach();
  }, []);

  return projection$;
}

function useBranch<T>(projection$: Projection<T>, key: T): Signal<T | undefined> {
  const branch$ = useSignal(projection$.value());

  useEffect(() => {
    projection$.set(key, branch$);
    return () => projection$.delete(key);
  }, [key]);

  return branch$;
}

export { useProjection, useBranch };
