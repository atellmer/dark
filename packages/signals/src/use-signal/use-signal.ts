import { useMemo } from '@dark-engine/core';

import { signal } from '../signal';

function useSignal<T>(value: T) {
  return useMemo(() => signal(value), []);
}

export { useSignal };
