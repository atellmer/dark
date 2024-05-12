import { useMemo } from '@dark-engine/core';

import { SharedState, setSharedState, Flow } from '../state';
import { type Spring } from '../spring';
import { type SpringItemConfig, type SpringApi, useSprings } from '../use-springs';

function useTrail<T extends string>(
  count: number,
  configurator: (idx: number) => SpringItemConfig<T>,
  deps?: Array<any>,
): [Array<Spring<T>>, TrailApi<T>] {
  const state = useMemo(() => {
    const state = new SharedState();

    state.setIsTrail(true);
    setSharedState(state);

    return state;
  }, []);
  const [springs, _api] = useSprings(count, configurator, deps);
  const api = useMemo<TrailApi<T>>(() => {
    return {
      ..._api,
      marker: 'trail-api',
      reverse: (value: boolean) => (value ? state.setFlow(Flow.LEFT) : state.setFlow(Flow.RIGHT)),
    };
  }, []);

  return [springs, api];
}

export type TrailApi<T extends string = string> = {
  reverse: (value: boolean) => void;
} & SpringApi<T>;

export { useTrail };
