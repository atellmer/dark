import { useMemo } from '@dark-engine/core';

import { type Selector, computed } from '../computed';

function useComputed<T>(selector: Selector<T>) {
  return useMemo(() => computed(selector), []);
}

export { useComputed };
