import { useLayoutEffect, nextTick } from '@dark-engine/core';

import { type SpringApi } from '../use-springs';

type Api = Pick<SpringApi, 'start' | 'chain' | 'delay' | 'on'>;

function useChain(chain: Array<Api>, timesteps?: Array<number>, timeframe = 1000) {
  chain.forEach((link, idx) => link.chain(idx > 0));

  useLayoutEffect(() => {
    const offs: Array<() => void> = [];

    for (let i = 0; i < chain.length; i++) {
      const api = chain[i];
      const nextApi = chain[i + 1];

      api.delay(0);

      if (nextApi) {
        if (timesteps) {
          const time = timesteps[i + 1] * timeframe;
          const off = api.on('series-start', () => {
            nextTick(() => {
              nextApi.delay(time);
              nextApi.start();
            });
          });

          offs.push(off);
        } else {
          offs.push(api.on('series-end', () => nextApi.start()));
        }
      }
    }

    return () => offs.forEach(x => x());
  }, [...chain]);
}

export { useChain };
