import { useMemo } from '@dark-engine/core';

import { SharedState, setSharedState } from '../state';
import { type SpringItemConfig, useSprings } from '../use-springs';

function useTrail<T extends string>(
  count: number,
  configurator: (idx: number) => SpringItemConfig<T>,
  deps?: Array<any>,
) {
  useMemo(() => {
    const state = new SharedState();

    state.setIsTrail(true);
    setSharedState(state);
  }, []);
  const results = useSprings(count, configurator, deps);

  return results;
}

export { useTrail };
