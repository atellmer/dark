import { useMemo, useEffect } from '@dark-engine/core';
import { AbstractSignal } from '../abstract-signal';
import { Signal } from '../signal';
import { useSignal } from '../use-signal';
import { type Split, split } from '../split';

function useSplit<T>(signal$: AbstractSignal<T>): Split<T> {
  const split$ = useMemo(() => split(signal$), []);

  useEffect(() => {
    split$.attach();
    return () => split$.detach();
  }, []);

  return split$;
}

function useSplitSignal<T>(split$: Split<T>, key: T): Signal<T | undefined> {
  const signal$ = useSignal(split$.actual());

  useEffect(() => {
    split$.set(key, signal$);
    return () => split$.delete(key);
  }, [key]);

  return signal$;
}

export { useSplit, useSplitSignal };
