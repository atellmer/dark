import { useMemo } from '@dark-engine/core';

import { SharedState, setSharedState } from '../shared-state';
import { type SpringItemOptions, useSprings } from '../use-springs';

function useTrail<T extends string>(count: number, configurator: (idx: number) => SpringItemOptions<T>) {
  useMemo(() => {
    const state = new SharedState();

    state.setIsTrail(true);
    setSharedState(state);
  }, []);
  const results = useSprings(count, configurator);

  return results;
}

export { useTrail };
