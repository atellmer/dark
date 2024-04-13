import { useActiveRouteContext, checkContextValue } from '../context';
import { type Params } from '../create-routes';

function useParams(): Params {
  const active = useActiveRouteContext();

  checkContextValue(active);

  return active.params;
}

export { Params, useParams };
