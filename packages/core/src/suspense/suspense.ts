import { createComponent } from '../component';
import { useState } from '../use-state';
import { createContext } from '../context';
import { useContext } from '../use-context';
import { useMemo } from '../use-memo';
import { useCallback } from '../use-callback';
import type { DarkElement } from '../shared';

const $$suspense = Symbol('suspense');

type SuspenseProps = {
  fallback: DarkElement;
};

type SuspenseContextValue = {
  fallback: DarkElement;
  isLoaded: boolean;
  trigger: () => void;
};

const SuspenseContext = createContext<SuspenseContextValue>({
  fallback: null,
  isLoaded: true,
  trigger: () => {},
});

const Suspense = createComponent<SuspenseProps>(
  ({ fallback, slot }) => {
    if (!fallback) {
      throw new Error(`Suspense fallback doesn't found`);
    }
    const { isLoaded: isSuspenseLoaded } = useContext(SuspenseContext);
    const [isLoaded, setIsLoaded] = useState(false);
    const trigger = useCallback(() => setIsLoaded(true), []);
    const value = useMemo(() => ({ fallback, isLoaded, trigger }), [fallback, isLoaded]);

    return SuspenseContext.Provider({
      value,
      slot: isSuspenseLoaded ? slot : null,
    });
  },
  { token: $$suspense },
);

export { SuspenseContext, Suspense };
