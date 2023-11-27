import { type SubscriberWithValue } from '../shared';

type EventName = 'finish' | 'chunk' | 'data';

class EventEmitter {
  private subscribers: Partial<Record<EventName, Set<SubscriberWithValue<unknown>>>> = {};

  on<T>(e: EventName, sub: SubscriberWithValue<T>) {
    !this.subscribers[e] && (this.subscribers[e] = new Set()), this.subscribers[e].add(sub);

    return () => this.subscribers[e] && this.subscribers[e].delete(sub);
  }

  emit<T>(e: EventName, data?: T) {
    this.subscribers[e] && this.subscribers[e].forEach(x => x(data));
  }

  kill() {
    this.subscribers = {};
  }
}

export { EventEmitter };
