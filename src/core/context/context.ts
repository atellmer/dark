import { Component, createComponent } from '../component';
import { isFunction } from '@helpers';

type Context<T> = {
  Provider: Component<ContexProviderProps<T>>;
  Consumer: Component<any>;
  displayName?: string;
}

type ContexProviderProps<T> = {
  value: T;
}

function createContext<T>(defaultValue: T): Context<T> {
  const $$token = Symbol('context');
  let displayName = 'Context';

  const Provider = createComponent<ContexProviderProps<T>>(({ value, slot }) => {
    //console.log('slot', slot);
    console.log('xxx', value);

    return slot;
  }, { displayName: `${displayName}.Povider` });

  const Consumer = createComponent(({ slot }) => {

    return isFunction(slot) ? slot() : slot;
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
