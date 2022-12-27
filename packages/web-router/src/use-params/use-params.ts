import { useRouterContext } from '../context';

function useParams() {
  const { paramsMap } = useRouterContext();

  return paramsMap;
}

export { useParams };
