import type { Subscribe, Subscriber } from '../shared';
import { useState } from '../use-state';
import { useEffect } from '../use-effect';

function useSyncExternalStore<T>(subscribe: Subscribe<Subscriber>, getSnapshot: () => T) {
  const [state, setState] = useState(getSnapshot());

  useEffect(() => {
    const unsubscribe = subscribe(() => {
      setState(getSnapshot());
    });

    return () => unsubscribe();
  }, [getSnapshot]);

  return state;
}

export { useSyncExternalStore };
