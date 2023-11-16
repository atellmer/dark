import { useLayoutEffect } from '@dark-engine/core';

import { type SpringApi } from '../use-springs';

type Link = Pick<SpringApi, 'start' | 'chain' | 'on'>;

function useChain(chain: Array<Link>, timesteps?: Array<number>, timeframe = 1000) {
  chain.forEach((link, idx) => link.chain(idx > 0));

  useLayoutEffect(() => {
    const offs: Array<() => void> = [];

    for (let i = 0; i < chain.length; i++) {
      const link = chain[i];
      const nextLink = chain[i + 1];

      if (nextLink) {
        if (timesteps) {
          const time = timesteps[i + 1] * timeframe;
          const off = link.on('series-start', () => {
            const reset = () => clearTimeout(timer);
            const timer = setTimeout(() => {
              const idx = offs.findIndex(x => x === reset);

              idx !== -1 && offs.splice(idx, 1);
              nextLink.start();
            }, time);

            offs.push(reset);
          });

          offs.push(off);
        } else {
          offs.push(link.on('series-end', () => nextLink.start()));
        }
      }
    }

    return () => offs.forEach(x => x());
  }, [...chain]);
}

export { useChain };
