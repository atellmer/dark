import { type Subscribe, type SubscriberWithValue } from '../shared';
import { useLayoutEffect } from '../use-layout-effect';
import { detectIsFunction, illegal } from '../utils';
import { detectIsServer } from '../platform';
import { useState } from '../use-state';
import { $$scope } from '../scope';

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
    illegal('[Dark]: getServerSnapshot was not found!');
  }

  const [state, setState] = useState(isSSR ? getServerSnapshot() : getSnapshot());

  useLayoutEffect(() => subscribe(() => setState(getSnapshot())), [getSnapshot]);

  return state;
}

export { useSyncExternalStore };
