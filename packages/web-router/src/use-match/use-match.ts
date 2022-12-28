import { useActiveRouteContext, checkContextValue } from '../context';

function useMatch() {
  const value = useActiveRouteContext();
  checkContextValue(value);
  const { matched, url } = value;
  if (!matched) return null;

  const { cursor } = matched;
  const path = cursor.fullPath;

  return {
    path,
    url,
  };
}

export { useMatch };
