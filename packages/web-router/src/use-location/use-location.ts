import { useMemo } from '@dark-engine/core';
import { useActiveRouteContext, checkContextValue } from '../context';

export type Location = {
  pathname: string;
  key: string;
};

function useLocation(): Location {
  const activeRoute = useActiveRouteContext();
  checkContextValue(activeRoute);
  const { pathname } = activeRoute;
  const key = useMemo(() => getKey(), [pathname]);
  const value: Location = { pathname, key };

  return value;
}

let nextKeyId = 200000;

const getKey = () => (++nextKeyId).toString(32);

export { useLocation };
