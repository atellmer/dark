import { createComponent } from '@dark/core/component';
import { useState } from '@dark/core/use-state';
import { createContext } from '@dark/core/context';
import { useContext } from '@dark/core/use-context';
import { useMemo } from '@dark/core/use-memo';
import { useCallback } from '@dark/core/use-callback';
import type { DarkElement } from '@dark/core/shared';

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

const Suspense = createComponent<SuspenseProps>(({ fallback, slot }) => {
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
});

export { SuspenseContext, Suspense };
