type Subscriber<T = unknown> = (data?: T) => void;

type EventName = 'finish' | 'chunk';

class EventEmitter {
  private map: Partial<Record<EventName, Set<Subscriber>>> = {};

  public on<T>(e: EventName, sub: Subscriber<T>) {
    !this.map[e] && (this.map[e] = new Set()), this.map[e].add(sub);

    return () => this.map[e].delete(sub);
  }

  public emit<T>(e: EventName, data?: T) {
    this.map[e] && this.map[e].forEach(x => x(data));
  }
}

const emitter = new EventEmitter();

export { emitter };
