import { type Callback, type Subscriber } from '@dark-engine/core';

abstract class AbstractSignal<T = unknown> {
  protected value: T = null;
  abstract peek(): T;
  abstract get(): T;
  abstract __on(subscriber: Subscriber): Callback;
  abstract __trackSelf(): void;
  abstract __getVersion(): number;
}

export { AbstractSignal };
