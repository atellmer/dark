import { detectIsServer, detectIsHydration } from '../platform';
import { resolveSuspense } from '../walk';
import { useMemo } from '../use-memo';
import { $$scope } from '../scope';

function useCursor() {
  return $$scope().getCursorFiber();
}

function useSSR() {
  const isServer = detectIsServer();
  const isHydration = detectIsHydration();
  const isSSR = isServer || isHydration;

  return {
    isServer,
    isHydration,
    isSSR,
  };
}
function useInSuspense() {
  const cursor = useCursor();
  const suspense = useMemo(() => resolveSuspense(cursor), [cursor]);

  return Boolean(suspense);
}

export { useCursor as __useCursor, useSSR as __useSSR, useInSuspense as __useInSuspense };
