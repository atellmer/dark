import { type SubscriberWithValue } from '../shared';

type EventName = 'prefinish' | 'finish' | 'chunk' | 'error';

class EventEmitter<E extends string = EventName, T = unknown> {
  private subscribers: Map<Partial<E>, Set<SubscriberWithValue<unknown>>> = new Map();

  on<T>(e: E, fn: SubscriberWithValue<T>) {
    !this.subscribers.has(e) && this.subscribers.set(e, new Set());
    this.subscribers.get(e).add(fn);

    return () => this.subscribers.has(e) && this.subscribers.get(e).delete(fn);
  }

  emit(e: E, data?: T) {
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
