import { EventEmitter, detectIsFunction, type Subscriber } from '@dark-engine/core';

import { addToContext } from '../context';
import { AbstractSignal } from '../abstract-signal';

type Value<T> = T | ((x: T) => T);

class Signal<T = unknown> extends AbstractSignal<T> {
  private emitter = new EventEmitter<'set'>();
  private version = 0;

  constructor(value: T) {
    super();
    this.value = value;
  }

  get(): T {
    this.__trackSelf();
    return this.value;
  }

  set(x: Value<T>) {
    const value = detectIsFunction(x) ? x(this.value) : x;

    if (!Object.is(this.value, value)) {
      this.value = value;
      this.version = ++this.version;
      this.emitter.emit('set');
    }
  }

  __on(subscriber: Subscriber) {
    return this.emitter.on('set', subscriber);
  }

  __trackSelf() {
    addToContext(this);
  }

  __getVersion() {
    return this.version;
  }

  __getSize() {
    return this.emitter.__getSize('set');
  }
}

const signal = <T>(value: T) => new Signal(value);

export { Signal, signal };
