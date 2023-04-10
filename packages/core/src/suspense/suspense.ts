import type { DarkElement, SlotProps } from '../shared';
import { component } from '../component';
import { createContext } from '../context';
import { useMemo } from '../use-memo';
import { useState } from '../use-state';
import { useEffect } from '../use-effect';
import { emitter } from '../emitter';
import { Fragment } from '../fragment';
import { isHydrateZone } from '../scope';
import { detectIsServer } from '../platform';
import { Shadow } from '../shadow';

type SuspenseProps = {
  fallback: DarkElement;
} & Required<SlotProps>;

type SuspenseContextValue = {
  isLoaded: boolean;
  fallback: DarkElement;
  reg: () => void;
  unreg: () => void;
};

const SuspenseContext = createContext<SuspenseContextValue>({
  isLoaded: false,
  fallback: null,
  reg: () => {},
  unreg: () => {},
});

const Suspense = component<SuspenseProps>(({ fallback, slot }) => {
  if (process.env.NODE_ENV !== 'production') {
    if (!fallback) {
      throw new Error(`[Dark]: Suspense fallback not found!`);
    }
  }
  const isEnabled = !detectIsServer() && !isHydrateZone.get();
  const [isLoaded, setIsLoaded] = useState(!isEnabled, { forceSync: true });
  const scope = useMemo(() => ({ size: 0 }), []);
  const value = useMemo<SuspenseContextValue>(
    () => ({ isLoaded, fallback, reg: () => scope.size++, unreg: () => scope.size-- }),
    [],
  );
  value.isLoaded = isLoaded;
  value.fallback = fallback;

  useEffect(() => {
    const off = emitter.on('finish', () => !isLoaded && scope.size === 0 && setIsLoaded(true));

    return off;
  }, []);

  const content = isLoaded
    ? [Shadow({ key: CONTENT, isVisible: true, isEnabled, slot })]
    : [Shadow({ key: CONTENT, isVisible: false, isEnabled, slot }), Fragment({ key: FALLBACK, slot: fallback })];

  return SuspenseContext.Provider({ value, slot: content });
});

const CONTENT = 1;
const FALLBACK = 2;

export { SuspenseContext, Suspense };
