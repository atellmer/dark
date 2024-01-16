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
    const map = this.state[key];
    const record = (map?.[id] || null) as CacheRecord<T>;

    return record;
  }

  write<T>({ key, id = CACHE_ROOT_ID, data }: WriteOptions<T>) {
    if (!this.state[key]) this.state[key] = {};
    const map = this.state[key];
    const record: CacheRecord = { id, isValid: true, modifiedAt: getTime(), data };

    map[id] = record;
    this.emitter.emit('change', { type: 'write', key, id, record });
  }

  optimistic<T>({ key, id = CACHE_ROOT_ID, data }: OptimisticOptions<T>) {
    if (!this.state[key]) this.state[key] = {};
    const map = this.state[key];
    const record: CacheRecord = { id, isValid: false, modifiedAt: getTime(), data };

    map[id] = record;
    this.emitter.emit('change', { type: 'optimistic', key, id, record });
  }

  invalidate({ key, id = CACHE_ROOT_ID }: InvalidateOptions) {
    const map = this.state[key];
    if (!map) return;
    const record = map[id];
    if (!record) return;
    record.isValid = false;
    this.emitter.emit('change', { type: 'invalidate', key, id, record });
  }

  delete({ key, id = CACHE_ROOT_ID }: DeleteOptions) {
    if (!this.state[key]) return;
    const map = this.state[key];

    delete map[id];
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
type EventType = 'write' | 'optimistic' | 'invalidate' | 'delete';
type EventData = { type: EventType; key: string; id: TextBased; record?: CacheRecord };

type BaseOptions = {
  key: string;
  id?: TextBased;
};

type ReadOptions = BaseOptions;

type WriteOptions<T> = {
  data: T;
} & BaseOptions;

type OptimisticOptions<T> = {
  data: T;
} & BaseOptions;

type InvalidateOptions = BaseOptions;

type DeleteOptions = BaseOptions;

export type CacheRecord<T = unknown> = {
  id: TextBased;
  data: T;
  isValid: boolean;
  modifiedAt: number;
};

const CACHE_ROOT_ID = '__ROOT__';

export { CACHE_ROOT_ID, InMemoryCache, CacheProvider, useCache };
