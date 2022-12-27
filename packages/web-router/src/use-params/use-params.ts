import { useActiveRouteContext } from '../context';

function useParams() {
  const { paramsMap } = useActiveRouteContext();

  return paramsMap;
}

export { useParams };
