import { useEffect, useUpdate } from '@dark-engine/core';

import { effect } from '../effect';
import { AbstractSignal } from '../abstract-signal';
import { setContext } from '../context';

type UnwrapSignal<T> = T extends AbstractSignal<infer V> ? V : never;

function useWatch<T extends readonly AbstractSignal<any>[]>(signals: T) {
  const update = useUpdate();
  const values = signals.map(x => x.peek()) as { [K in keyof T]: UnwrapSignal<T[K]> };

  setContext(null);
  useEffect(() => {
    let canUpdate = false;

    return effect(() => {
      signals.forEach(x => x.get());
      canUpdate && update();
      canUpdate = true;
    });
  }, []);

  return values;
}

export { useWatch };
