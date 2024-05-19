import { type ComponentFactory, component } from '../component';
import { type SlotProps, type KeyProps } from '../shared';
import { useLayoutEffect } from '../use-layout-effect';
import { __useCursor as useCursor } from '../internal';
import { EventEmitter } from '../emitter';
import { useUpdate } from '../use-update';
import { detectIsEqual } from '../utils';
import { type Fiber } from '../fiber';
import { useMemo } from '../use-memo';

type CreateContextOptions = {
  displayName?: string;
};

function createContext<T>(defaultValue: T, options?: CreateContextOptions): Context<T> {
  const { displayName = 'Component' } = options || {};
  const context = component<ContexProps<T>>(
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
    { displayName: `Context(${displayName})` },
  ) as Context<T>;

  context.defaultValue = defaultValue;
  Object.freeze(context);

  return context;
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

export type ContexProps<T> = {
  value: T;
} & SlotProps &
  KeyProps;

export type Context<T> = ComponentFactory<ContexProps<T>> & { defaultValue: T };

export type ContextProvider<T = unknown> = {
  value: T;
  emitter: EventEmitter<'publish'>;
};

export { createContext, useContext };
