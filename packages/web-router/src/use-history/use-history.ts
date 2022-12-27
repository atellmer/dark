import { useRouterHistoryContext, checkContextValue } from '../context';

function useHistory() {
  const value = useRouterHistoryContext();

  checkContextValue(value);

  return value.history;
}

export { useHistory };
