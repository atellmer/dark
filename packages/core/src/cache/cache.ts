import { type DarkElement, type TextBased, type SubscriberWithValue } from '../shared';
import { createContext, useContext } from '../context';
import { EventEmitter } from '../emitter';
import { component } from '../component';
import { getTime } from '../utils';
class InMemoryCache {
  private state: State;
  private emitter = new EventEmitter<EventName, EventData>();

  constructor(state?: State) {
    this.state = state || {};
  }

  get() {
    return this.state;
  }

  read<T>({ key, id = CACHE_ROOT_ID }: ReadOptions) {
    const data = this.state[key];
    const record = (data?.[id] as CacheRecord<T>) || null;

    return record;
  }

  write<T>({ key, id = CACHE_ROOT_ID, value, optimistic }: WriteOptions<T>) {
    if (!this.state[key]) this.state[key] = {};
    const data = this.state[key];
    const record: CacheRecord = { id, isValid: !optimistic, modifiedAt: getTime(), value };

    data[id] = record;
    this.emitter.emit('change', { type: 'write', key, id, record });
  }

  invalidate({ key, id = CACHE_ROOT_ID }: InvalidateOptions) {
    const data = this.state[key];
    if (!data) return;
    const record = data[id];
    if (!record) return;
    record.isValid = false;
    this.emitter.emit('change', { type: 'invalidate', key, id, record });
  }

  delete({ key, id = CACHE_ROOT_ID }: DeleteOptions) {
    if (!this.state[key]) return;
    const data = this.state[key];

    delete data[id];
    this.emitter.emit('change', { type: 'delete', key, id });
  }

  onChange(subscriber: SubscriberWithValue<EventData>) {
    return this.emitter.on('change', subscriber);
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

type State = Record<string, Record<string, CacheRecord>>;
type EventName = 'change';
type EventType = 'write' | 'invalidate' | 'delete';
type EventData = { type: EventType; key: string; id: TextBased; record?: CacheRecord };

type ReadOptions = {
  key: string;
  id?: TextBased;
};

type WriteOptions<T> = {
  key: string;
  value: T;
  id?: TextBased;
  optimistic?: boolean;
};

type InvalidateOptions = {
  key: string;
  id?: TextBased;
};

type DeleteOptions = {
  key: string;
  id?: TextBased;
};

export type CacheRecord<T = unknown> = {
  id: TextBased;
  value: T;
  isValid: boolean;
  modifiedAt: number;
};

const CACHE_ROOT_ID = '__ROOT__';

export { CACHE_ROOT_ID, InMemoryCache, CacheProvider, useCache };
