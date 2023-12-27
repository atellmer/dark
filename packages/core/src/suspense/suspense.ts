import type { DarkElement, SlotProps } from '../shared';
import { component } from '../component';
import { createContext } from '../context';
import { useMemo } from '../use-memo';
import { useState } from '../use-state';
import { useLayoutEffect } from '../use-layout-effect';
import { Fragment } from '../fragment';
import { $$scope } from '../scope';
import { detectIsServer } from '../platform';
import { Shadow } from '../shadow';
import { dummyFn } from '../utils';

type SuspenseProps = {
  name: string;
  fallback: DarkElement;
} & Required<SlotProps>;

type SuspenseContextValue = {
  loading: (x: boolean) => void;
};

const SuspenseContext = createContext<SuspenseContextValue>({ loading: dummyFn });

const Suspense = component<SuspenseProps>(({ name, fallback, slot }) => {
  if (process.env.NODE_ENV !== 'production') {
    if (!fallback) {
      throw new Error(`[Dark]: Suspense fallback not found!`);
    }
  }
  const $scope = $$scope();
  const emitter = $scope.getEmitter();
  const [isLoaded, setIsLoaded] = useState(() => detectIsServer() || $scope.getIsHydrateZone());
  const scope = useMemo(() => ({ size: 0 }), []);
  const loading = (x: boolean) => (x ? scope.size++ : scope.size--);
  const value = useMemo<SuspenseContextValue>(() => ({ loading }), []);
  const content = [
    Shadow({ key: CONTENT, isVisible: isLoaded, slot }),
    isLoaded ? null : Fragment({ key: FALLBACK, slot: fallback }),
  ].filter(Boolean);

  useLayoutEffect(() => {
    const fn = () => scope.size === 0 && setIsLoaded(true);
    const off = emitter.on('finish', fn);

    return off;
  }, []);

  return SuspenseContext.Provider({ value, slot: content });
});

const CONTENT = 1;
const FALLBACK = 2;

export { SuspenseContext, Suspense };
