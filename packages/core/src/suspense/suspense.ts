import type { DarkElement, SlotProps } from '../shared';
import { component } from '../component';
import { createContext, useContext } from '../context';
import { useMemo } from '../use-memo';
import { useState } from '../use-state';
import { useUpdate } from '../use-update';
import { useLayoutEffect } from '../use-layout-effect';
import { emitter } from '../emitter';
import { Fragment } from '../fragment';
import { scope$$ } from '../scope';
import { detectIsServer } from '../platform';
import { Shadow } from '../shadow';
import { detectIsFiberAlive } from '../walk';

type SuspenseProps = {
  fallback: DarkElement;
} & Required<SlotProps>;

type SuspenseContextValue = {
  isLoaded: boolean;
  fallback: DarkElement;
  update: () => void;
  reg: () => void;
  unreg: () => void;
};

const SuspenseContext = createContext<SuspenseContextValue>({
  isLoaded: false,
  fallback: null,
  update: () => {},
  reg: () => {},
  unreg: () => {},
});

const Suspense = component<SuspenseProps>(({ fallback, slot }) => {
  if (process.env.NODE_ENV !== 'production') {
    if (!fallback) {
      throw new Error(`[Dark]: Suspense fallback not found!`);
    }
  }

  const { update: update$$ } = useContext(SuspenseContext);
  const [isLoaded, setIsLoaded] = useState(() => detectIsServer() || scope$$().getIsHydrateZone());
  const update$ = useUpdate();
  const scope = useMemo(() => ({ size: 0 }), []);
  const fiber = scope$$().getCursorFiber();
  const update = () => (detectIsFiberAlive(fiber) ? update$() : update$$());
  const value = useMemo<SuspenseContextValue>(
    () => ({ isLoaded, fallback, update, reg: () => scope.size++, unreg: () => scope.size-- }),
    [],
  );

  value.update = update;
  value.isLoaded = isLoaded;
  value.fallback = fallback;

  useLayoutEffect(() => {
    const off = emitter.on('finish', () => !isLoaded && scope.size === 0 && setIsLoaded(true));

    return off;
  }, []);

  const content = isLoaded
    ? [Shadow({ key: CONTENT, isVisible: true, slot })]
    : [Shadow({ key: CONTENT, isVisible: false, slot }), Fragment({ key: FALLBACK, slot: fallback })];

  return SuspenseContext.Provider({ value, slot: content });
});

const CONTENT = 1;
const FALLBACK = 2;

export { SuspenseContext, Suspense };
