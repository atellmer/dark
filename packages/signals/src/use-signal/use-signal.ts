import { useMemo, useUpdate } from '@dark-engine/core';

import { signal } from '../signal';
import { effect } from '../effect';

function useSignal<T>(value: T) {
  const update = useUpdate();
  const signal$ = useMemo(() => {
    let isCompiled = false;
    const signal$ = signal(value);

    effect(() => {
      signal$.get();
      isCompiled && update();
      isCompiled = true;
    });

    return signal$;
  }, []);

  return signal$;
}

export { useSignal };
