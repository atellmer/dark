import { type DarkElement, type SlotProps, type KeyProps } from '../shared';
import { type ComponentFactory, component } from '../component';
import { detectIsFunction, detectIsEqual } from '../utils';
import { useLayoutEffect } from '../use-layout-effect';
import { __useCursor as useCursor } from '../internal';
import { EventEmitter } from '../emitter';
import { useUpdate } from '../use-update';
import { type Fiber } from '../fiber';
import { useMemo } from '../use-memo';

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
      const cursor = useCursor();
      const { hook } = cursor;
      let providers = hook.getProviders();

      if (!providers) {
        providers = new Map();
        providers.set(context, { value, emitter: new EventEmitter() });
        hook.setProviders(providers);
      }

      const provider = providers.get(context);

      // should be sync
      useLayoutEffect(() => {
        provider.emitter.emit('publish', value);
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
  const cursor = useCursor();
  const scope = useMemo(() => ({ value: null, provider: getProvider<T>(context, cursor) }), []);
  const update = useUpdate();
  const { provider } = scope;
  const value = provider ? provider.value : defaultValue;

  // !
  useLayoutEffect(() => {
    if (!provider) return;
    return provider.emitter.on('publish', (value: T) => {
      !detectIsEqual(scope.value, value) && update();
    });
  }, []);

  scope.value = value;

  return value;
}

function getProvider<T>(context: Context<T>, fiber: Fiber) {
  let $fiber = fiber;

  while ($fiber) {
    const providers = $fiber.hook?.getProviders();
    if (providers?.has(context)) return providers.get(context) as ContextProvider<T>;
    $fiber = $fiber.parent;
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

export type ContextProvider<T = unknown> = {
  value: T;
  emitter: EventEmitter<'publish'>;
};

export { createContext, useContext };
