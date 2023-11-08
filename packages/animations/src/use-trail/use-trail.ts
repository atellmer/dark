import { useMemo } from '@dark-engine/core';

import { SharedState, setSharedState } from '../shared-state';
import { type ItemOptions, useSprings } from '../use-springs';

function useTrail<T extends string>(count: number, configurator: (idx: number) => ItemOptions<T>) {
  useMemo(() => setSharedState(new SharedState(true)), []);
  const results = useSprings(count, configurator);

  return results;
}

export { useTrail };
