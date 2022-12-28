import { useMemo } from '@dark-engine/core';

import { useActiveRouteContext, useCurrentPathContext, checkContextValue } from '../context';
import { pathnameFromPath } from '../create-routes';

export type Match = {
  path: string;
  url: string;
};

function useMatch(): Match {
  const activeRoute = useActiveRouteContext();
  checkContextValue(activeRoute);
  const path = useCurrentPathContext();
  const { pathname } = activeRoute;
  const url = useMemo(() => (path ? pathnameFromPath(pathname, path) : ''), [path, pathname]);
  const value: Match = { path, url };

  return value;
}

export { useMatch };
