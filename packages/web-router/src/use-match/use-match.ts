import { useMemo } from '@dark-engine/core';

import { useActiveRouteContext, useCurrentPathContext, checkContextValue } from '../context';
import { mergePathnames } from '../create-routes';

export type Match = {
  path: string;
  url: string;
};

function useMatch() {
  const activeRoute = useActiveRouteContext();
  checkContextValue(activeRoute);
  const routePath = useCurrentPathContext();
  const {
    location: { pathname: urlPath },
  } = activeRoute;
  const url = useMemo(() => (routePath ? mergePathnames(urlPath, routePath) : ''), [urlPath, routePath]);
  const value: Match = { path: routePath, url };

  return value;
}

export { useMatch };
