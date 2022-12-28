import { createComponent } from '../component';
import { createContext } from '../context';
import { useMemo } from '../use-memo';
import type { DarkElement, SlotProps } from '../shared';

type SuspenseProps = {
  fallback: DarkElement;
} & Required<SlotProps>;

type SuspenseContextValue = {
  fallback: DarkElement;
};

const SuspenseContext = createContext<SuspenseContextValue>({ fallback: null });

const Suspense = createComponent<SuspenseProps>(({ fallback, slot }) => {
  if (!fallback) {
    throw new Error(`[Dark]: Suspense fallback not found!`);
  }
  const value = useMemo(() => ({ fallback }), [fallback]);

  return SuspenseContext.Provider({ value, slot });
});

export { SuspenseContext, Suspense };
