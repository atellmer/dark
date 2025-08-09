import { useEffect, useUpdate } from '@dark-engine/core';

import { effect } from '../effect';
import { AbstractSignal } from '../abstract-signal';

function useWatch<T extends readonly AbstractSignal[]>(signals: T) {
  const update = useUpdate();

  useEffect(() => {
    let canUpdate = false;

    effect(() => {
      signals.forEach(x => x.get());
      canUpdate && update();
      canUpdate = true;
    });
  }, []);
}

export { useWatch };
