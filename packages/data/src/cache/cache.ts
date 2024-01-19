import { type TextBased, type SubscriberWithValue, EventEmitter, getTime, nextTick } from '@dark-engine/core';

import { ROOT_ID } from '../constants';

class InMemoryCache<K extends string = string> {
  private state: State;
  private emitter1 = new EventEmitter<EventName, EventData<K>>();
  private emitter2 = new EventEmitter<EventName, MonitorEventData<K>>();
  private keys = new Set<K>();

  constructor(state?: State) {
    this.state = state || {};
  }

  getState() {
    return this.state;
  }

  read<T>({ key, id = ROOT_ID }: ReadOptions<K>) {
    const map = this.state[key];
    const record = (map?.[id] || null) as CacheRecord<T>;

    return record;
  }

  write<T>({ key, id = ROOT_ID, data }: WriteOptions<T, K>) {
    if (!this.state[key]) this.state[key] = {};
    const map = this.state[key];
    const record: CacheRecord = { id, valid: true, modifiedAt: getTime(), data };

    map[id] = record;
    this.emitter1.emit('change', { type: 'write', key, id, record });
  }

  optimistic<T>({ key, id = ROOT_ID, data }: OptimisticOptions<T, K>) {
    if (!this.state[key]) this.state[key] = {};
    const map = this.state[key];
    const record: CacheRecord = { id, valid: false, modifiedAt: getTime(), data };

    map[id] = record;
    this.emitter1.emit('change', { type: 'optimistic', key, id, record });
  }

  invalidate({ key, id = ROOT_ID }: InvalidateOptions<K>) {
    const map = this.state[key];
    if (!map) return;
    const record = map[id];
    if (!record) return;
    record.valid = false;
    this.emitter1.emit('change', { type: 'invalidate', key, id, record });
  }

  delete({ key, id = ROOT_ID }: DeleteOptions<K>) {
    if (!this.state[key]) return;
    const map = this.state[key];

    delete map[id];
    this.emitter1.emit('change', { type: 'delete', key, id });
  }

  subscribe(subscriber: SubscriberWithValue<EventData<K>>) {
    return this.emitter1.on('change', subscriber);
  }

  monitor(subscriber: SubscriberWithValue<MonitorEventData<K>>) {
    return this.emitter2.on('change', subscriber);
  }

  __emit(data: MonitorEventData<K>) {
    this.emitter2.emit('change', data);
  }

  __canUpdate(key: K) {
    if (!this.keys.has(key)) {
      this.keys.add(key);
      nextTick(() => this.keys.delete(key));
      return true;
    }

    return false;
  }
}

type State = Record<string, Record<string, CacheRecord>>;

type EventName = 'change';
type EventType = 'write' | 'optimistic' | 'invalidate' | 'delete';
type EventData<K extends string> = { type: EventType; key: K; id?: TextBased; record?: CacheRecord };
export type MonitorEventPhase = 'start' | 'finish' | 'error';
export type MonitorEventData<K extends string> = {
  type: MonitorEventType;
  phase: MonitorEventPhase;
  key: K;
  data?: unknown;
};

type BaseOptions<K> = {
  key: K;
  id?: TextBased;
};

export type ReadOptions<K> = BaseOptions<K>;
export type WriteOptions<T, K> = { data: T } & BaseOptions<K>;
export type OptimisticOptions<T, K> = { data: T } & BaseOptions<K>;
export type InvalidateOptions<K> = BaseOptions<K>;
export type DeleteOptions<K> = BaseOptions<K>;

export type CacheRecord<T = unknown> = {
  id: TextBased;
  data: T;
  valid: boolean;
  modifiedAt: number;
};

export enum MonitorEventType {
  QUERY = 'QUERY',
  MUTATION = 'MUTATION',
}

function checkCache(cache: InMemoryCache) {
  if (!cache) throw new Error('[data]: the hook requires a provider with a client!');
}

export { InMemoryCache, checkCache };
