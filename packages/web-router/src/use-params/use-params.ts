import { useActiveRouteContext, checkContextValue } from '../context';
import { type Params } from '../create-routes';

function useParams(): Params {
  const value = useActiveRouteContext();

  checkContextValue(value);

  return value.params;
}

export { Params, useParams };
