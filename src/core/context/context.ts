import { getTime, isFunction } from '@helpers';
import { Component, createComponent } from '../component';
import useEffect from '../hooks/use-effect';
import useState from '../hooks/use-state';
import useMemo from '../hooks/use-memo';
import { getMountedComponentId } from '../scope';

type Context<T> = {
  Provider: Component<ContexProviderProps<T>>;
  Consumer: Component<any>;
  displayName?: string;
};

type ContexProviderProps<T> = {
  value: T;
};

type ContextStoreItem<T = any> = {
  subscribers: Array<(value: T) => void>;
  value: T;
};

type ContextStore<T> = Record<string, ContextStoreItem<T>>;

const sortProvidersIds = (a: string, b: string) => b.length - a.length;

function getContextStoreItem(contextStore: Record<string, any>, componentId: string): ContextStoreItem {
  const providerIds = Object.keys(contextStore).sort(sortProvidersIds);

  for (const providerId of providerIds) {
    if (componentId.indexOf(providerId) === 0) {
      return contextStore[providerId];
    }
  }
}

function createContext<T>(defaultValue: T): Context<T> {
  const $$token = Symbol('context');
  const contextStore: ContextStore<T> = {};
  let displayName = 'Context';

  const Provider = createComponent<ContexProviderProps<T>>(
    ({ value, slot }) => {
      const componentId = getMountedComponentId();

      if (!contextStore[componentId]) {
        contextStore[componentId] = {
          subscribers: [],
          value: null,
        };
      }

      const contextStoreItem = contextStore[componentId];

      contextStoreItem.value = value;

      useEffect(
        () => {
          for (const subscriber of contextStoreItem.subscribers) {
            subscriber(value);
          }
          contextStoreItem.subscribers = [];
        },
        [value],
      );

      return slot;
    },
    { displayName: `${displayName}.Povider` },
  );

  const Consumer = createComponent(
    ({ slot }) => {
      const componentId = getMountedComponentId();
      const contextStoreItem = getContextStoreItem(contextStore, componentId);
      const value = contextStoreItem ? contextStoreItem.value : defaultValue;
      const scope = useMemo(() => ({ prevValue: value }), []);
      const [_, forceUpdate] = useState(0);

      useEffect(
        () => {
          const hasProvider = Boolean(contextStoreItem);

          if (hasProvider) {
            const { subscribers } = contextStoreItem;
            const subscriber = (newValue: T) => {
              if (!Object.is(scope.prevValue, newValue)) {
                forceUpdate(getTime());
              }
            };

            subscribers.push(subscriber);

            return () => subscribers.splice(subscribers.length - 1, 1);
          }
        },
        [value],
      );

      scope.prevValue = value;

      return isFunction(slot) ? slot(value) : null;
    },
    { displayName: `${displayName}.Consumer` },
  );

  const context = {
    $$token,
    displayName,
    Provider,
    Consumer,
  };

  Object.defineProperty(context, 'displayName', {
    get: () => displayName,
    set: (newValue: string) => (displayName = newValue),
  });

  return context;
}

export default createContext;
