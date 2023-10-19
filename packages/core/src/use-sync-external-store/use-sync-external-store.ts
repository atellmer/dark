import type { Subscribe, Subscriber } from '../shared';
import { useState } from '../use-state';
import { useEffect } from '../use-effect';

function useSyncExternalStore<T>(subscribe: Subscribe<Subscriber>, getSnapshot: () => T) {
  const [state, setState] = useState(getSnapshot());

  useEffect(() => subscribe(() => setState(getSnapshot())), [getSnapshot]);

  return state;
}

export { useSyncExternalStore };
