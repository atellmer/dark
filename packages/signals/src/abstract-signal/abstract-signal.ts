import { type Callback, type Subscriber } from '@dark-engine/core';

abstract class AbstractSignal<T = unknown> {
  protected value: T = null;
  abstract get(): T;
  abstract __on(subscriber: Subscriber): Callback;
  abstract __trackSelf(): void;
  abstract __getVersion(): number;

  peek(): T {
    return this.value;
  }

  toString() {
    return String(this.value);
  }

  toJSON() {
    return this.value;
  }

  valueOf() {
    return this.value;
  }
}

export { AbstractSignal };
