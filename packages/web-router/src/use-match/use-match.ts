import { useMemo } from '@dark-engine/core';

import { useActiveRouteContext, useCurrentPathContext, checkContextValue } from '../context';
import { mergePaths } from '../create-routes';

export type Match = {
  path: string;
  url: string;
};

function useMatch() {
  const activeRoute = useActiveRouteContext();
  checkContextValue(activeRoute);
  const path = useCurrentPathContext();
  const {
    location: { pathname: url },
  } = activeRoute;
  const $url = useMemo(() => (path ? mergePaths(url, path) : ''), [url, path]);
  const value: Match = { path, url: $url };

  return value;
}

export { useMatch };
