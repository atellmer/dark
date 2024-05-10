import { usePendingContext, checkContextValue } from '../context';

function usePending() {
  const pending$ = usePendingContext();

  checkContextValue(pending$);

  return pending$.val();
}

export { usePending };
