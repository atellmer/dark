import { Component, createComponent } from '../component';
import { isFunction, getTime, flatten } from '@helpers';
import { getMountedComponentId, getVirtualDOM, getAppUid, getComponentVirtualNodesById } from '../scope';
import { getVirtualNodeByRoute, VirtualNode } from '../vdom/vnode';
import useEffect from '../hooks/use-effect';
import useState from '../hooks/use-state';

type Context<T> = {
  Provider: Component<ContexProviderProps<T>>;
  Consumer: Component<any>;
  displayName?: string;
}

type ContexProviderProps<T> = {
  value: T;
}

function getContextValueByComponentId(contextStore: Record<string, any>, componentId: string): any {
  const providerIds = Object.keys(contextStore);

  for (const providerId of providerIds) {
    if (componentId.indexOf(providerId) === 0) {
      return contextStore[providerId];
    }
  }
}

function createContext<T>(defaultValue: T): Context<T> {
  const $$token = Symbol('context');
  let displayName = 'Context';
  let contextStore = {};
  let subscribers = [];

  const Provider = createComponent<ContexProviderProps<T>>(({ value, slot }) => {
    const componentId = getMountedComponentId();
    contextStore[componentId] = value || defaultValue;
    
    useEffect(() => {
      for(const subscriber of subscribers) {
        subscriber(value);
      }
      subscribers = [];
    }, [value]);

    return slot;
  }, { displayName: `${displayName}.Povider` });

  const Consumer = createComponent(({ slot }) => {
    const componentId = getMountedComponentId();
    const value = getContextValueByComponentId(contextStore, componentId);
    const [_, forceUpdate] = useState(0);

    useEffect(() => {
      const subscriber = (newValue: any) => {
        if (!Object.is(value, newValue)) {
          forceUpdate(getTime());
        }
      };
      subscribers.push(subscriber);
      const idx = subscribers.length - 1;
      return () => subscribers.splice(idx, 1);
    }, [value]);

    return isFunction(slot) ? slot(value) : slot;
  }, { displayName: `${displayName}.Consumer` });

  const context = {
    $$token,
    displayName,
    Provider,
    Consumer,
  };

  Object.defineProperty(context, 'displayName', {
    get: () => displayName,
    set: (newValue: string) => displayName = newValue,
  });

  return context;
}

export default createContext;
