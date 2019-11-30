import { Component, createComponent } from '../component';
import { isFunction } from '@helpers';
import { getMountedComponentId } from '../scope';

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

  const Provider = createComponent<ContexProviderProps<T>>(({ value, slot }) => {
    const componentId = getMountedComponentId();

    contextStore[componentId] = value;

    return slot;
  }, { displayName: `${displayName}.Povider` });

  const Consumer = createComponent(({ slot }) => {
    const componentId = getMountedComponentId();
    const value = getContextValueByComponentId(contextStore, componentId) || defaultValue;

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
