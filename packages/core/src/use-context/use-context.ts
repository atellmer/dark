import { useEffect } from '../use-effect';
import { useMemo } from '../use-memo';
import { currentFiberStore } from '../scope';
import { useUpdate } from '../use-update';
import type { Fiber } from '../fiber';
import type { Context, ContextProviderValue } from '../context';

function useContext<T>(context: Context<T>): T {
  const { defaultValue } = context;
  const fiber = currentFiberStore.get();
  const provider = useMemo(() => getProvider<T>(context, fiber), []);
  const value = provider ? provider.value : defaultValue;
  const update = useUpdate();
  const scope = useMemo(() => ({ value }), []);
  const hasProvider = Boolean(provider);

  useEffect(() => {
    if (!hasProvider) return;
    const unsubscribe = provider.subscribe((value: T) => {
      if (!Object.is(scope.value, value)) {
        update();
      }
    });

    return () => unsubscribe();
  }, [hasProvider]);

  scope.value = value;

  return value;
}

function getProvider<T>(context: Context<T>, fiber: Fiber): ContextProviderValue<T> {
  let nextFiber = fiber;

  while (nextFiber) {
    if (nextFiber.provider && nextFiber.provider.get(context)) {
      return nextFiber.provider.get(context) as ContextProviderValue<T>;
    }

    nextFiber = nextFiber.parent;
  }

  return null;
}

export { useContext };
