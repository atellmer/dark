import { useMemo, useEffect } from '@dark-engine/core';

import { type AbstractSignal } from '../abstract-signal';
import { type Split, split } from '../split';
import { type Signal } from '../signal';
import { type Computed } from '../computed';
import { useSignal } from '../use-signal';
import { useComputed } from '../use-computed';

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

function useSplitComputed<T, V>(split$: Split<T>, key: T, selector: (x: T) => V): Computed<V | undefined> {
  const signal$ = useSplitSignal(split$, key);
  const computed$ = useComputed(() => selector(signal$.get()));

  return computed$;
}

export { useSplit, useSplitSignal, useSplitComputed };
