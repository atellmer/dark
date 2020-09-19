import { createComponent } from '@core/component';
import { Context, ContexProviderProps } from './model';
import { useEffect } from '@core/use-effect';
import { componentFiberHelper } from '@core/scope';
import { useContext } from '@core/use-context';
import { isFunction } from '@helpers';


function createContext<T>(defaultValue: T): Context<T> {
  let displayName = 'Context';
  const context: Context<T> = {
    displayName,
    defaultValue,
    Provider: createProvider(),
    Consumer: createConsumer(),
  };

  function createProvider() {
    return createComponent<ContexProviderProps<T>>(
      ({ value = defaultValue, slot }) => {
        const fiber = componentFiberHelper.get();

        if (!fiber.provider) {
          fiber.provider = new Map();
        }

        if (!fiber.provider.get(context)) {
          fiber.provider.set(context, {
            subscribers: [],
            value,
          });
        }

        const provider = fiber.provider.get(context);

        useEffect(() => {
          for (const subscriber of provider.subscribers) {
            subscriber(value);
          }
        }, [value]);

        provider.value = value;

        return slot;
      },
      { displayName: `${displayName}.Provider` },
    );
  };

  function createConsumer() {
    return createComponent(
      ({ slot }) => {
        const value = useContext(context);

        return isFunction(slot) ? slot(value) : null;
      },
      { displayName: `${displayName}.Consumer` },
    );
  };

  Object.defineProperty(context, 'displayName', {
    get: () => displayName,
    set: (newValue: string) => {
      displayName = newValue;
      context.Provider = createProvider();
      context.Consumer = createConsumer();
    },
  });

  return context;
}

export {
  createContext,
};
