import { useMemo, useEffect } from '@dark-engine/core';

import { type AbstractSignal } from '../abstract-signal';
import { type Branches, branches } from '../branches';
import { type Signal } from '../signal';
import { useSignal } from '../use-signal';

function useBranches<T>(signal$: AbstractSignal<T>): Branches<T> {
  const branch$ = useMemo(() => branches(signal$), []);

  useEffect(() => {
    branch$.attach();
    return () => branch$.detach();
  }, []);

  return branch$;
}

function useBranch<T>(branch$: Branches<T>, key: T): Signal<T | undefined> {
  const signal$ = useSignal(branch$.actual());

  useEffect(() => {
    branch$.set(key, signal$);
    return () => branch$.delete(key);
  }, [key]);

  return signal$;
}

export { useBranches, useBranch };
