import {
  type Subscriber,
  EventEmitter,
  detectIsFunction,
  getRootId,
  $$scope,
  createUpdate,
  CLEANUP_HOST_MASK,
} from '@dark-engine/core';

import { addToContext } from '../context';
import { AbstractSignal } from '../abstract-signal';

type Value<T> = T | ((x: T) => T);

type Equal<T> = (prev: T, next: T) => boolean;

type Options<T> = {
  equal: Equal<T>;
};

class Signal<T = unknown> extends AbstractSignal<T> {
  private emitter = new EventEmitter<'set'>();
  private version = 0;
  private equal: Equal<T>;

  constructor(value: T, options?: Options<T>) {
    super();
    this.value = value;
    this.equal = options?.equal || defaultEqual;
  }

  get(): T {
    this.__trackSelf();
    return this.value;
  }

  set(x: Value<T>) {
    const value = detectIsFunction(x) ? x(this.value) : x;

    if (!this.equal(this.value, value)) {
      this.value = value;
      this.version = ++this.version;
      this.emitter.emit('set');
    }
  }

  __on(subscriber: Subscriber) {
    return this.emitter.on('set', subscriber);
  }

  __trackSelf() {
    addToContext(this, this.__connectToHost());
  }

  __getVersion() {
    return this.version;
  }

  __getSize() {
    return this.emitter.__getSize('set');
  }

  __connectToHost(): boolean {
    const cursor = $$scope()?.getCursor();
    if (!cursor) return false;
    const { hook } = cursor;
    const off = this.__on(createUpdate(getRootId(), hook));

    cursor.markHost(CLEANUP_HOST_MASK);
    if (!hook.cleanups) hook.cleanups = new Map();
    hook.cleanups.get(this)?.();
    hook.cleanups.set(this, off);

    return true;
  }
}

const defaultEqual = <T>(prev: T, next: T) => Object.is(prev, next);

const signal = <T>(value: T, options?: Options<T>) => new Signal(value, options);

export { Signal, signal };
