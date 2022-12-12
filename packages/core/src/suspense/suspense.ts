import { createComponent } from '../component';
import { useState } from '../use-state';
import { createContext, useContext } from '../context';
import { useMemo } from '../use-memo';
import { useCallback } from '../use-callback';
import type { DarkElement, SlotProps } from '../shared';

type SuspenseProps = {
  fallback: DarkElement;
} & Required<SlotProps>;

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
    throw new Error(`[Dark]: Suspense fallback not found`);
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
