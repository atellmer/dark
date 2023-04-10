import type { DarkElement, SlotProps } from '../shared';
import { component } from '../component';
import { createContext } from '../context';
import { useMemo } from '../use-memo';
import { useState } from '../use-state';
import { useEffect } from '../use-effect';
import { useLayoutEffect } from '../use-layout-effect';
import { emitter } from '../emitter';
import { Fragment } from '../fragment';
import { currentFiberStore, isHydrateZone } from '../scope';
import { collectElements, getFiberWithElement } from '../walk';
import { platform, detectIsServer } from '../platform';

type SuspenseProps = {
  fallback: DarkElement;
} & Required<SlotProps>;

type SuspenseContextValue = {
  reg: () => void;
  unreg: () => void;
};

const SuspenseContext = createContext<SuspenseContextValue>({
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
  const value = useMemo<SuspenseContextValue>(() => ({ reg: () => scope.size++, unreg: () => scope.size-- }), []);

  useEffect(() => {
    const off = emitter.on('finish', () => !isLoaded && scope.size === 0 && setIsLoaded(true));

    return off;
  }, []);

  const content = isLoaded
    ? [Content({ key: CONTENT, isLoaded: true, isEnabled, slot })]
    : [Content({ key: CONTENT, isLoaded: false, isEnabled, slot }), Fragment({ key: FALLBACK, slot: fallback })];

  return SuspenseContext.Provider({ value, slot: content });
});

const $$content = Symbol('content');

type ContentProps = {
  isEnabled: boolean;
  isLoaded: boolean;
  slot: DarkElement;
};

const Content = component<ContentProps>(
  ({ isEnabled, isLoaded, slot }) => {
    const fiber = currentFiberStore.get();

    if (isLoaded) {
      delete fiber.inv;
    } else {
      fiber.inv = true;
    }

    useLayoutEffect(() => {
      if (!isEnabled || !isLoaded) return;
      const fiber$ = getFiberWithElement(fiber);
      const fibers = collectElements(fiber, x => x);

      for (const fiber of fibers) {
        platform.insertElement(fiber.element, fiber.eidx, fiber$.element);
      }
    }, [isLoaded]);

    return slot || null;
  },
  { token: $$content },
);

const CONTENT = 1;
const FALLBACK = 2;

export { SuspenseContext, Suspense };
