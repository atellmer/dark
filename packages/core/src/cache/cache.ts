import { type DarkElement, type SubscriberWithValue } from '../shared';
import { createContext, useContext } from '../context';
import { EventEmitter } from '../emitter';
import { component } from '../component';
import { getTime } from '../utils';

class InMemoryCache {
  private state = new Map<CacheKey, Record<string, CacheRecord>>();
  private emitter = new EventEmitter<EventName, EventData>();

  read<T>(key: CacheKey, id: string = CACHE_ROOT_ID) {
    const data = this.state.get(key);
    const record = (data?.[id] as CacheRecord<T>) || null;

    return record;
  }

  write<T>(key: CacheKey, value: T, id: string = CACHE_ROOT_ID) {
    if (!this.state.has(key)) this.state.set(key, {});
    const data = this.state.get(key);
    const record: CacheRecord = { id, isValid: true, modifiedAt: getTime(), value };

    data[id] = record;
    this.emitter.emit('write', { key, record });
  }

  invalidate(key: CacheKey, id: string = CACHE_ROOT_ID) {
    const data = this.state.get(key);
    if (!data) return;
    const record = data[id];
    if (!record) return;
    record.isValid = false;
    this.emitter.emit('invalidate', { key, record });
  }

  onWrite(subscriber: SubscriberWithValue<EventData>) {
    return this.emitter.on('write', subscriber);
  }

  onInvalidate(subscriber: SubscriberWithValue<EventData>) {
    return this.emitter.on('invalidate', subscriber);
  }
}

const CacheContext = createContext<InMemoryCache>(null, { displayName: 'InMemoryCache' });

const useCache = () => useContext(CacheContext);

type CacheProviderProps = {
  cache: InMemoryCache;
  slot: DarkElement;
};

const CacheProvider = component<CacheProviderProps>(({ cache, slot }) => {
  return CacheContext.Provider({ value: cache, slot });
});

type EventName = 'write' | 'invalidate';

type EventData = { key: CacheKey; record: CacheRecord };

export type CacheKey = string | symbol;

export type CacheRecord<T = unknown> = {
  id: string;
  value: T;
  isValid: boolean;
  modifiedAt: number;
};

const CACHE_ROOT_ID = '__ROOT__';

export { CACHE_ROOT_ID, InMemoryCache, CacheProvider, useCache };
