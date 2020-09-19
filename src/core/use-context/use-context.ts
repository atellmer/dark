
import { Fiber } from '@core/fiber';
import { Context, ContextProviderValue } from '@core/context/model';
import { useEffect } from '@core/use-effect';
import { useMemo } from '@core/use-memo';
import { componentFiberHelper } from '@core/scope';
import { useUpdate } from '@core/use-update';


function useContext<T>(context: Context<T>): T {
  const { defaultValue } = context;
  const fiber = componentFiberHelper.get();
  const provider = getProvider<T>(context, fiber);
  const value = provider ? provider.value : defaultValue;
  const [update] = useUpdate();
  const scope = useMemo(() => ({ prevValue: value, update }), []);
  const hasProvider = Boolean(provider);

  useEffect(() => {
    if (!hasProvider) return;

    const subscriber = (newValue: T) => {
      if (!Object.is(scope.prevValue, newValue)) {
        scope.update();
      }
    };

    provider.subscribers.push(subscriber);

    return () => {
      const idx = provider.subscribers.findIndex(x => x === subscriber);

      if (idx !== -1) {
        provider.subscribers.splice(idx, 1);
      }
    };
  }, [hasProvider]);

  scope.prevValue = value;
  scope.update = update;

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

export {
  useContext,
};
