import { useActiveRouteContext, checkContextValue } from '../context';
import { type ParamsMap } from '../create-routes';

function useParams(): ParamsMap {
  const value = useActiveRouteContext();

  checkContextValue(value);

  return value.paramsMap;
}

export { ParamsMap, useParams };
