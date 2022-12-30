import { useMemo } from '@dark-engine/core';

import { useActiveRouteContext, useCurrentPathContext, checkContextValue } from '../context';
import { createPathname } from '../create-routes';

export type Match = {
  path: string;
  url: string;
};

function useMatch(): Match {
  const activeRoute = useActiveRouteContext();
  checkContextValue(activeRoute);
  const path = useCurrentPathContext();
  const {
    location: { pathname },
  } = activeRoute;
  const url = useMemo(() => (path ? createPathname(pathname, path) : ''), [path, pathname]);
  const value: Match = { path, url };

  return value;
}

export { useMatch };
