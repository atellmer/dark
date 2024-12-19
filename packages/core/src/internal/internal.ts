import { detectIsServer, detectIsHydration } from '../platform';
import { resolveSuspense, createLoc } from '../walk';
import { $$scope, getRootId } from '../scope';
import { useMemo } from '../use-memo';

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

function useLoc() {
  const rootId = getRootId();
  const cursor = useCursor();
  const { hook } = cursor;
  const { idx } = hook;
  const loc = createLoc(rootId, idx, hook);

  return loc;
}

export { useCursor as __useCursor, useSSR as __useSSR, useInSuspense as __useInSuspense, useLoc as __useLoc };
