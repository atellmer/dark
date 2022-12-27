import { useActiveRouteContext, checkContextValue } from '../context';

function useMatch() {
  const value = useActiveRouteContext();
  checkContextValue(value);
  const { matched, pathname } = value;
  if (!matched) return null;

  const { cursor } = matched;
  const path = cursor.fullPath;
  const value$ = {
    path,
    url: pathname,
  };

  return value$;
}

export { useMatch };
