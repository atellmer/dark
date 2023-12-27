import type { DarkElement, SlotProps, Callback } from '../shared';
import { component } from '../component';
import { createContext, useContext } from '../context';
import { useMemo } from '../use-memo';
import { useState } from '../use-state';
import { useUpdate } from '../use-update';
import { useLayoutEffect } from '../use-layout-effect';
import { Fragment } from '../fragment';
import { $$scope } from '../scope';
import { detectIsServer } from '../platform';
import { Shadow } from '../shadow';
import { detectIsFiberAlive } from '../walk';
import { dummyFn } from '../utils';

type SuspenseProps = {
  fallback: DarkElement;
} & Required<SlotProps>;

type SuspenseContextValue = {
  update: Callback;
  on: Callback;
  off: Callback;
};

const SuspenseContext = createContext<SuspenseContextValue>({
  update: dummyFn,
  on: dummyFn,
  off: dummyFn,
});

const Suspense = component<SuspenseProps>(({ fallback, slot }) => {
  if (process.env.NODE_ENV !== 'production') {
    if (!fallback) {
      throw new Error(`[Dark]: Suspense fallback not found!`);
    }
  }
  const $scope = $$scope();
  const emitter = $scope.getEmitter();
  const { update: $$update } = useContext(SuspenseContext);
  const [isLoaded, setIsLoaded] = useState(() => detectIsServer() || $scope.getIsHydrateZone());
  const $update = useUpdate();
  const scope = useMemo(() => ({ size: 0 }), []);
  const fiber = $scope.getCursorFiber();
  const update = () => (detectIsFiberAlive(fiber) ? $update() : $$update());
  const value = useMemo<SuspenseContextValue>(() => ({ update, on: () => scope.size++, off: () => scope.size-- }), []);
  const content = [
    Shadow({ key: CONTENT, isVisible: isLoaded, slot }),
    isLoaded ? null : Fragment({ key: FALLBACK, slot: fallback }),
  ].filter(Boolean);

  useLayoutEffect(() => {
    const fn = () => scope.size === 0 && setIsLoaded(true);
    const off = emitter.on('finish', fn);

    return off;
  }, []);

  value.update = update;

  return SuspenseContext.Provider({ value, slot: content });
});

const CONTENT = 1;
const FALLBACK = 2;

export { SuspenseContext, Suspense };
