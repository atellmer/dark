import { useActiveRouteContext, checkContextValue } from '../context';

function useLocation() {
  const active = useActiveRouteContext();

  checkContextValue(active);

  return active.location;
}

export { useLocation };
