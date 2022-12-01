import type { DarkElement } from '../shared';
import { detectIsFunction } from '../helpers';
import { createComponent } from '../component';
import { useEffect } from '../use-effect';
import { currentFiberStore } from '../scope';
import { useContext } from '../use-context';
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
  return createComponent<ContexProviderProps<T>>(
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
  return createComponent<ConsumerProps<T>>(
    ({ slot }) => {
      const value = useContext(context);

      return detectIsFunction(slot) ? slot(value) : null;
    },
    { displayName: `${displayName}.Consumer` },
  );
}

export { createContext };
