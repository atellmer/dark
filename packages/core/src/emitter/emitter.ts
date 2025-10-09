import { type SubscriberWithValue } from '../shared';

type EventName = 'finish' | 'chunk' | 'error' | 'box';

class EventEmitter<E extends string = EventName, T = unknown> {
  private subscribers: Map<Partial<E>, Set<SubscriberWithValue<unknown>>> = new Map();

  on<T>(e: E, fn: SubscriberWithValue<T>) {
    !this.subscribers.has(e) && this.subscribers.set(e, new Set());
    this.subscribers.get(e).add(fn);

    return () => this.subscribers.has(e) && this.subscribers.get(e).delete(fn);
  }

  emit(e: E, data?: T) {
    if (!this.subscribers.has(e)) return;
    const subs = Array.from(this.subscribers.get(e));

    for (const sub of subs) sub(data);
  }

  kill() {
    this.subscribers = new Map();
  }

  __getSize(e?: E) {
    return e ? this.subscribers.get(e)?.size ?? 0 : this.subscribers.size;
  }
}

export { EventEmitter };
