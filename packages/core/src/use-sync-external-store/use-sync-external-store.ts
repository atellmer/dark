import { type Subscribe, type SubscriberWithValue } from '../shared';
import { detectIsFunction, illegal, formatErrorMsg } from '../utils';
import { useLayoutEffect } from '../use-layout-effect';
import { __useSSR as useSSR } from '../internal';
import { useState } from '../use-state';
import { LIB } from '../constants';

function useSyncExternalStore<T>(
  subscribe: Subscribe<SubscriberWithValue<T>>,
  getSnapshot: () => T,
  getServerSnapshot?: () => T,
) {
  const { isSSR } = useSSR();

  if (isSSR && !detectIsFunction(getServerSnapshot)) {
    illegal(formatErrorMsg(LIB, 'getServerSnapshot was not found!'));
  }

  const [state, setState] = useState(isSSR ? getServerSnapshot() : getSnapshot());

  useLayoutEffect(() => subscribe(() => setState(getSnapshot())), [getSnapshot]);

  return state;
}

export { useSyncExternalStore };
