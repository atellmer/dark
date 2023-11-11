import { useLayoutEffect } from '@dark-engine/core';

import { type SpringsApi } from '../use-springs';

type ChainLink = Pick<SpringsApi, 'start' | 'back' | 'on'>;

function useChain(chain: Array<ChainLink>) {
  useLayoutEffect(() => {
    const off: Array<() => void> = [];

    for (let i = 0; i < chain.length; i++) {
      const link = chain[i];
      const nextLink = chain[i + 1];
      const prevLink = chain[i - 1];

      if (nextLink) {
        off.push(link.on('series-end-forward', () => nextLink.start()));
      }

      if (prevLink) {
        off.push(link.on('series-end-backward', () => prevLink.back()));
      }
    }

    return () => off.forEach(x => x());
  }, [chain.length]);
}

export { useChain };
