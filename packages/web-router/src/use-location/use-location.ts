import { useActiveRouteContext, checkContextValue } from '../context';

function useLocation() {
  const activeRoute = useActiveRouteContext();

  checkContextValue(activeRoute);

  return activeRoute.location;
}

export { useLocation };
