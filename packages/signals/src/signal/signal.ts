import {
  type Subscriber,
  type Callback,
  EventEmitter,
  detectIsFunction,
  getRootId,
  $$scope,
  createUpdate,
  detectIsUndefined,
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
  private map: Map<T, Subscriber>;

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
      const prevValue = this.value;

      this.value = value;
      this.version = ++this.version;
      this.emitter.emit('set');

      if (this.map) {
        this.map.get(prevValue)?.();
        this.map.get(value)?.();
      }
    }
  }

  __on(subscriber: Subscriber, key?: T): Callback {
    if (!detectIsUndefined(key)) {
      if (!this.map) this.map = new Map();
      this.map.set(key, subscriber);

      return () => this.map.delete(key);
    }

    return this.emitter.on('set', subscriber);
  }

  __trackSelf() {
    addToContext(this, this.__connectToHost());
  }

  __getVersion(): number {
    return this.version;
  }

  __getSize(): number {
    return this.emitter.__getSize('set');
  }

  __connectToHost(): boolean {
    const cursor = $$scope()?.getCursor();
    if (!cursor) return false;
    const { hook } = cursor;

    hook.createCleanup(this, () => this.__on(createUpdate(getRootId(), hook)));

    return true;
  }
}

const defaultEqual = <T>(prev: T, next: T) => Object.is(prev, next);

const signal = <T>(value: T, options?: Options<T>) => new Signal(value, options);

export { Signal, signal };
