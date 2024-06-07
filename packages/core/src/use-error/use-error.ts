import { __useCursor as useCursor } from '../internal';
import { useEffect } from '../use-effect';
import { useUpdate } from '../use-update';
import { useMemo } from '../use-memo';

function useError(): Error | null {
  const cursor = useCursor();
  const update = useUpdate();
  const scope = useMemo<ErrorScope>(() => ({ error: null }), []);

  cursor.hook.setCatcher((error: Error) => {
    scope.error = error;
    update();
  });

  useEffect(() => {
    scope.error = null;
  }, [scope.error]);

  return scope.error;
}

type ErrorScope = { error: Error };

export { useError };
