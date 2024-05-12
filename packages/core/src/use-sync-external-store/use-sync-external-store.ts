import { type Subscribe, type Subscriber } from '../shared';
import { detectIsFunction, illegal } from '../utils';
import { useLayoutEffect } from '../use-layout-effect';
import { __useSSR as useSSR } from '../internal';
import { useState } from '../use-state';

function useSyncExternalStore<T>(subscribe: Subscribe<Subscriber>, getSnapshot: () => T, getServerSnapshot?: () => T) {
  const { isSSR } = useSSR();

  if (isSSR && !detectIsFunction(getServerSnapshot)) {
    illegal('getServerSnapshot was not found!');
  }

  const [state, setState] = useState(isSSR ? getServerSnapshot() : getSnapshot());

  useLayoutEffect(() => subscribe(() => setState(getSnapshot())), [getSnapshot]);

  return state;
}

export { useSyncExternalStore };
