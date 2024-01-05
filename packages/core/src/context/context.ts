import type { DarkElement, Subscribe, SubscriberWithValue, SlotProps, KeyProps } from '../shared';
import { type ComponentFactory, component } from '../component';
import type { Fiber } from '../fiber';
import { detectIsFunction } from '../utils';
import { $$scope } from '../scope';
import { useEffect } from '../use-effect';
import { useMemo } from '../use-memo';
import { useUpdate } from '../use-update';

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
      const fiber = $$scope().getCursorFiber();

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
  const fiber = $$scope().getCursorFiber();
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

    return unsubscribe;
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

type ContexProviderProps<T> = {
  value: T;
} & SlotProps &
  KeyProps;

export type Context<T = unknown> = {
  Provider: ComponentFactory<ContexProviderProps<T>>;
  Consumer: ComponentFactory<SlotProps<(value: T) => DarkElement>>;
  displayName?: string;
  defaultValue: T;
};

export type ContextProviderValue<T = unknown> = {
  value: T;
  subscribers: Set<(value: T) => void>;
  subscribe: Subscribe<SubscriberWithValue<T>>;
};

export { createContext, useContext };
