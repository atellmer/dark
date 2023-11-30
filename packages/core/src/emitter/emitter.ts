import { type SubscriberWithValue } from '../shared';

type EventName = 'finish' | 'chunk' | 'data';

class EventEmitter<T = unknown> {
  private subscribers: Map<Partial<EventName>, Set<SubscriberWithValue<unknown>>> = new Map();

  on<T>(e: EventName, fn: SubscriberWithValue<T>) {
    !this.subscribers.has(e) && this.subscribers.set(e, new Set());
    this.subscribers.get(e).add(fn);

    return () => this.subscribers.has(e) && this.subscribers.get(e).delete(fn);
  }

  emit(e: EventName, data?: T) {
    this.subscribers.has(e) && this.subscribers.get(e).forEach(x => x(data));
  }

  kill() {
    this.subscribers = new Map();
  }

  __getSize() {
    return this.subscribers.size;
  }
}

export { EventEmitter };
