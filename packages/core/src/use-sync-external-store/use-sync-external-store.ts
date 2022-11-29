import { useState } from '../use-state';
import { useEffect } from '../use-effect';

type Sunscribe = (cb: () => void) => Unsubscribe;
type Unsubscribe = () => void;

function useSyncExternalStore<T>(subscribe: Sunscribe, getSnapshot: () => T) {
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
