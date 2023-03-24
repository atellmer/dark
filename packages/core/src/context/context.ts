import type { DarkElement } from '../shared';
import type { Fiber } from '../fiber';
import { detectIsFunction } from '../helpers';
import { currentFiberStore } from '../scope';
import { component } from '../component';
import { useEffect } from '../use-effect';
import { useMemo } from '../use-memo';
import { useUpdate } from '../use-update';
import type { Context, ContexProviderProps, ContextProviderValue } from './types';

type CreateContextOptions = {
  displayName?: string;
};

function createContext<T>(defaultValue: T, options?: CreateContextOptions): Context<T> {
  const { displayName = 'Context' } = options || {};
  const context: Context<T> = {
    displayName,
    defaultValue,
    Provider: null,
    Consumer: null,
  };

  context.Provider = createProvider(context, defaultValue, displayName);
  context.Consumer = createConsumer(context, displayName);

  return context;
}

function createProvider<T>(context: Context<T>, defaultValue: T, displayName: string) {
  return component<ContexProviderProps<T>>(
    ({ value = defaultValue, slot }) => {
      const fiber = currentFiberStore.get();

      if (!fiber.provider) {
        const providerValue: ContextProviderValue<T> = {
          value,
          subscribers: new Set(),
          subscribe: (subscriber: (value: T) => void) => {
            providerValue.subscribers.add(subscriber);

            return () => providerValue.subscribers.delete(subscriber);
          },
        };

        fiber.provider = new Map();
        fiber.provider.set(context, providerValue);
      }

      const provider = fiber.provider.get(context);

      useEffect(() => {
        provider.subscribers.forEach(fn => fn(value));
      }, [value]);

      provider.value = value;

      return slot;
    },
    { displayName: `${displayName}.Provider` },
  );
}

type ConsumerProps<T> = {
  slot: (value: T) => DarkElement;
};

function createConsumer<T>(context: Context<T>, displayName: string) {
  return component<ConsumerProps<T>>(
    ({ slot }) => {
      const value = useContext(context);

      return detectIsFunction(slot) ? slot(value) : null;
    },
    { displayName: `${displayName}.Consumer` },
  );
}

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

export { createContext, useContext };
