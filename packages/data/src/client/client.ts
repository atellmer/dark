import { type DarkElement, component, createContext, useContext } from '@dark-engine/core';

import { InMemoryCache } from '../cache';

class DataClient<A extends object = {}, K extends string = string> {
  private api: A;
  private cache: InMemoryCache<K>;

  constructor(options: { api: A; cache: InMemoryCache<K> }) {
    const { api, cache } = options;

    this.api = api;
    this.cache = cache;
  }

  getApi() {
    return this.api;
  }

  getCache() {
    return this.cache;
  }

  subscribe(...args: Parameters<typeof this.cache.subscribe>) {
    return this.cache.subscribe(...args);
  }

  monitor(...args: Parameters<typeof this.cache.monitor>) {
    return this.cache.monitor(...args);
  }
}

const DataClientContext = createContext<DataClient>(null, { displayName: 'DataClient' });

const useClient = <A extends object = {}, K extends string = string>() =>
  useContext(DataClientContext) as DataClient<A, K>;

const useApi = <A extends object = {}>() => useClient().getApi() as A;

const useCache = <K extends string = string>() => useClient().getCache() as InMemoryCache<K>;

type DataProviderProps = {
  client: DataClient;
  slot: DarkElement;
};

const DataProvider = component<DataProviderProps>(({ client, slot }) => {
  if (useClient()) throw new Error('[data]: illegal nested data client provider!');
  return DataClientContext.Provider({ value: client, slot });
});

export { DataClient, useClient, useApi, useCache, DataProvider };
