import { useRouterHistoryContext } from '../context';

function useHistory() {
  const { history } = useRouterHistoryContext();

  return history;
}

export { useHistory };
