import { useMemo } from '@dark-engine/core';

import { useActiveRouteContext, useCurrentPathContext, checkContextValue } from '../context';
import { fromPath } from '../create-routes';

export type Match = {
  path: string;
  url: string;
};

function useMatch(): Match {
  const activeRoute = useActiveRouteContext();
  checkContextValue(activeRoute);
  const path = useCurrentPathContext();
  const { url: url$ } = activeRoute;
  const url = useMemo(() => (path ? fromPath(url$, path) : ''), [path, url$]);
  const value: Match = { path, url };

  return value;
}

export { useMatch };
