import { useActiveRouteContext, checkContextValue } from '../context';

function useParams() {
  const value = useActiveRouteContext();

  checkContextValue(value);

  return value.paramsMap;
}

export { useParams };
