import { useEffect, useUpdate } from '@dark-engine/core';

import { effect } from '../effect';
import { AbstractSignal } from '../abstract-signal';
import { setContext } from '../context';

function useWatch<T extends readonly AbstractSignal[]>(signals: T) {
  const update = useUpdate();

  setContext(null);
  useEffect(() => {
    let canUpdate = false;

    return effect(() => {
      signals.forEach(x => x.get());
      canUpdate && update();
      canUpdate = true;
    });
  }, []);
}

export { useWatch };
