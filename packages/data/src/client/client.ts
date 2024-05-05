import {
  type DarkElement,
  type SubscriberWithValue,
  component,
  createContext,
  useContext,
  illegal,
  formatErrorMsg,
} from '@dark-engine/core';

import { type CacheEventData, type MonitorEventData, InMemoryCache } from '../cache';
import { LIB } from '../constants';

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

  subscribe(subscriber: SubscriberWithValue<CacheEventData<K>>) {
    return this.cache.subscribe(subscriber);
  }

  monitor(subscriber: SubscriberWithValue<MonitorEventData<K>>) {
    return this.cache.monitor(subscriber);
  }
}

const DataClientContext = createContext<DataClient>(null, { displayName: 'DataClient' });

const useClient = <A extends object = {}, K extends string = string>() =>
  useContext(DataClientContext) as DataClient<A, K>;

const useApi = <A extends object = {}>() => useClient().getApi() as A;

const useCache = <K extends string = string>() => useClient().getCache() as InMemoryCache<K>;

type DataClientProviderProps = {
  client: DataClient;
  slot: DarkElement;
};

const DataClientProvider = component<DataClientProviderProps>(({ client, slot }) => {
  if (useClient()) illegal(formatErrorMsg(LIB, 'Illegal nested data client provider!'));
  return DataClientContext.Provider({ value: client, slot });
});

export { DataClient, useClient, useApi, useCache, DataClientProvider };
