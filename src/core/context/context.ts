import { getTime, isFunction } from '@helpers';
import { Component, createComponent } from '../component';
import useEffect from '../hooks/use-effect';
import useState from '../hooks/use-state';
import useMemo from '../hooks/use-memo';
import { getMountedComponentId, getContextProviderStore, setContextProviderStore } from '../scope';

export type Context<T = unknown> = {
  Provider: Component<ContexProviderProps<T>>;
  Consumer: Component<any>;
  displayName?: string;
  defaultValue: T;
};

type ContexProviderProps<T> = {
  value: T;
};

type ContextProviderStoreItem<T = any> = {
  subscribers: Array<(value: T) => void>;
  value: T;
};

export type ContextProviderStore<T = any> = Record<string, ContextProviderStoreItem<T>>;

const sortProvidersIds = (a: string, b: string) => b.length - a.length;

function getContextProviderStoreItem(
  contextProviderStore: ContextProviderStore, componentId: string): ContextProviderStoreItem {
  const providerIds = Object.keys(contextProviderStore).sort(sortProvidersIds);

  for (const providerId of providerIds) {
    if (componentId.indexOf(providerId) === 0) {
      return contextProviderStore[providerId];
    }
  }
}

function createContext<T>(defaultValue: T): Context<T> {
  let displayName = 'Context';
  const context = {
    displayName,
    defaultValue,
    Provider,
    Consumer,
  };
  const contextProviderStore: ContextProviderStore<T> = {};

  function Provider(props) {
    return createComponent<ContexProviderProps<T>>(
      ({ value, slot }) => {
        const componentId = getMountedComponentId();

        if (!contextProviderStore[componentId]) {
          contextProviderStore[componentId] = {
            subscribers: [],
            value: null,
          };
        }

        const contextStoreItem = contextProviderStore[componentId];

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

        setContextProviderStore(context, contextProviderStore);

        return slot;
      },
      { displayName: `${displayName}.Povider` },
    )(props);
  }

  function Consumer(props) {
    return createComponent(
      ({ slot }) => {
        const value = useContext(context);

        return isFunction(slot) ? slot(value) : null;
      },
      { displayName: `${displayName}.Consumer` },
    )(props);
  }

  Object.defineProperty(context, 'displayName', {
    get: () => displayName,
    set: (newValue: string) => (displayName = newValue),
  });

  return context;
}

function useContext<T>(context: Context<T>): T {
  const componentId = getMountedComponentId();
  const { defaultValue } = context;
  const contextProviderStore = getContextProviderStore(context);

  if (!contextProviderStore) {
    return defaultValue;
  }

  const contextProviderStoreItem = getContextProviderStoreItem(contextProviderStore, componentId);
  const value = contextProviderStoreItem ? contextProviderStoreItem.value : defaultValue;
  const scope = useMemo(() => ({ prevValue: value }), []);
  const [_, forceUpdate] = useState(0);

  useEffect(
    () => {
      const hasProvider = Boolean(contextProviderStoreItem);

      if (hasProvider) {
        const { subscribers } = contextProviderStoreItem;
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

  return value;
}

export { useContext };
export default createContext;
