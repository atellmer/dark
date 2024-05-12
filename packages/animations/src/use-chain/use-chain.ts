import { type Callback, useMemo, useLayoutEffect, nextTick } from '@dark-engine/core';

import { type SpringApi } from '../use-springs';

type Api = Pick<SpringApi, 'marker' | 'start' | 'chain' | 'delay' | 'on'>;

type Scope = {
  offs: Array<Callback>;
};

function useChain(chain: Array<Api>, timesteps?: Array<number>, timeframe = 1000) {
  const scope = useMemo<Scope>(() => ({ offs: [] }), []);

  useMemo(() => {
    scope.offs.forEach(x => x());
    scope.offs = [];
    const { offs } = scope;

    chain.forEach((api, idx) => {
      api.chain(idx > 0);
      api.delay(0);
    });

    for (let i = 0; i < chain.length; i++) {
      const api = chain[i];
      const nextApi = chain[i + 1];

      if (nextApi) {
        if (timesteps) {
          const time = timesteps[i + 1] * timeframe;
          const off = api.on('series-start', () => {
            nextTick(() => {
              nextApi.start();
            });
          });

          nextApi.delay(time);
          offs.push(off);
        } else {
          offs.push(api.on('series-end', () => nextApi.start()));
        }
      }
    }
  }, [...chain]);

  useLayoutEffect(() => () => scope.offs.forEach(x => x()), []);
}

export { useChain };
