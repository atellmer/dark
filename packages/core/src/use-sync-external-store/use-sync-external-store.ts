import { type Subscribe, type SubscriberWithValue } from '../shared';
import { detectIsFunction, illegal, formatErrorMsg } from '../utils';
import { useLayoutEffect } from '../use-layout-effect';
import { detectIsServer } from '../platform';
import { useState } from '../use-state';
import { $$scope } from '../scope';
import { LIB } from '../constants';

function useSyncExternalStore<T>(
  subscribe: Subscribe<SubscriberWithValue<T>>,
  getSnapshot: () => T,
  getServerSnapshot?: () => T,
) {
  const $scope = $$scope();
  const isServer = detectIsServer();
  const isHydrateZone = $scope.getIsHydrateZone();
  const isSSR = isServer || isHydrateZone;

  if (isSSR && !detectIsFunction(getServerSnapshot)) {
    illegal(formatErrorMsg(LIB, 'getServerSnapshot was not found!'));
  }

  const [state, setState] = useState(isSSR ? getServerSnapshot() : getSnapshot());

  useLayoutEffect(() => subscribe(() => setState(getSnapshot())), [getSnapshot]);

  return state;
}

export { useSyncExternalStore };
