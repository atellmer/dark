import { useMemo, useUpdate } from '@dark-engine/core';

import { type Selector, computed } from '../computed';
import { effect } from '../effect';

function useComputed<T>(selector: Selector<T>) {
  const update = useUpdate();
  const computed$ = useMemo(() => {
    let isCompiled = false;
    const signal$ = computed(selector);

    effect(() => {
      signal$.get();
      isCompiled && update();
      isCompiled = true;
    });

    return signal$;
  }, []);

  return computed$;
}

export { useComputed };
