import { useState } from '../use-state';
import { useEffect } from '../use-effect';

type Subscribe = (cb: () => void) => Unsubscribe;
type Unsubscribe = () => void;

function useSyncExternalStore<T>(subscribe: Subscribe, getSnapshot: () => T) {
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
