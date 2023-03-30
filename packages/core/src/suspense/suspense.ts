import { component } from '../component';
import { createContext } from '../context';
import { useMemo } from '../use-memo';
import type { DarkElement, SlotProps } from '../shared';

type SuspenseProps = {
  fallback: DarkElement;
} & Required<SlotProps>;

type SuspenseContextValue = {} & Pick<SuspenseProps, 'fallback'>;

const SuspenseContext = createContext<SuspenseContextValue>({ fallback: null });

const Suspense = component<SuspenseProps>(({ fallback, slot }) => {
  if (process.env.NODE_ENV !== 'production') {
    if (!fallback) {
      throw new Error(`[Dark]: Suspense fallback not found!`);
    }
  }
  const value = useMemo(() => ({ fallback }), []);

  value.fallback = fallback;

  return SuspenseContext.Provider({ value, slot });
});

export { SuspenseContext, Suspense };
