import { useLayoutEffect } from '@dark-engine/core';

import { type SpringApi } from '../use-springs';

type ParallelItem = Pick<SpringApi, 'start' | 'back' | 'on'>;

function useParallel(parallel: Array<ParallelItem>) {
  useLayoutEffect(() => {
    const off: Array<() => void> = [];
    const main = parallel[0];

    for (let i = 1; i < parallel.length; i++) {
      const link = parallel[i];

      off.push(main.on('series-start-forward', () => link.start()));
      off.push(main.on('series-start-backward', () => link.back()));
    }

    return () => off.forEach(x => x());
  });
}

export { useParallel };
