import {
  type TextBased,
  type SubscriberWithValue,
  EventEmitter,
  getTime,
  nextTick,
  illegal,
  formatErrorMsg,
} from '@dark-engine/core';

import { ROOT_ID, LIB } from '../constants';

class InMemoryCache<K extends string = string> {
  private state: State = {};
  private emitter1 = new EventEmitter<EventName, CacheEventData<K>>();
  private emitter2 = new EventEmitter<EventName, MonitorEventData<K>>();
  private keys = new Set<K>();

  getState() {
    return this.state;
  }

  read<T>(key: K, options?: MethodOptions) {
    const { id = ROOT_ID } = options || {};
    const map = this.state[key];
    const record = (map?.[id] || null) as CacheRecord<T>;

    return record;
  }

  write<T>(key: K, data: T, options?: MethodOptions) {
    const { id = ROOT_ID } = options || {};
    if (!this.state[key]) this.state[key] = {};
    const map = this.state[key];
    const record: CacheRecord = { id, valid: true, modifiedAt: getTime(), data };

    map[id] = record;
    this.emitter1.emit('change', { type: 'write', key, id, record });
  }

  optimistic<T>(key: K, data: T, options?: MethodOptions) {
    const { id = ROOT_ID } = options || {};
    if (!this.state[key]) this.state[key] = {};
    const map = this.state[key];
    const record: CacheRecord = { id, valid: false, modifiedAt: getTime(), data };

    map[id] = record;
    this.emitter1.emit('change', { type: 'optimistic', key, id, record });
  }

  invalidate(key: K, options?: MethodOptions) {
    const { id = ROOT_ID } = options || {};
    const map = this.state[key];
    if (!map) return;
    const record = map[id];
    if (!record) return;
    record.valid = false;

    this.emitter1.emit('change', { type: 'invalidate', key, id, record });
  }

  delete(key: K, options?: MethodOptions) {
    const { id = ROOT_ID } = options || {};
    if (!this.state[key]) return;
    const map = this.state[key];

    delete map[id];
    this.emitter1.emit('change', { type: 'delete', key, id });
  }

  subscribe(subscriber: SubscriberWithValue<CacheEventData<K>>) {
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
type MethodOptions = { id?: TextBased };

type EventName = 'change';
export type CacheEventType = 'write' | 'optimistic' | 'invalidate' | 'delete';
export type CacheEventData<K extends string> = { type: CacheEventType; key: K; id?: TextBased; record?: CacheRecord };
export type MonitorEventType = 'query' | 'mutation';
export type MonitorEventPhase = 'start' | 'finish' | 'error';
export type MonitorEventData<K extends string> = {
  type: MonitorEventType;
  phase: MonitorEventPhase;
  key: K;
  data?: unknown;
};

export type CacheRecord<T = unknown> = {
  id: TextBased;
  data: T;
  valid: boolean;
  modifiedAt: number;
};

function checkCache(cache: InMemoryCache) {
  if (!cache) illegal(formatErrorMsg(LIB, 'The hook requires a provider with a client!'));
}

export { InMemoryCache, checkCache };
