import { throwThis, type Callback, type Subscriber } from '@dark-engine/core';

import { type SupportContext, getContext, setContext } from '../context';
import { AbstractSignal } from '../abstract-signal';

export type Selector<T> = () => T;

class Computed<T = unknown> extends AbstractSignal<T> implements SupportContext {
  private deps = new Set<AbstractSignal>();
  private versions: Map<AbstractSignal, number> = new Map();
  private selector: Selector<T>;

  constructor(selector: Selector<T>) {
    super();
    this.selector = selector;
    this.compute();
  }

  peek(): T {
    return this.value;
  }

  get() {
    this.__trackSelf();
    return this.detectIsDirty() ? this.compute() : this.value;
  }

  add(x: AbstractSignal<unknown>) {
    this.deps.add(x);
  }

  __on(subscriber: Subscriber) {
    const untrackers: Array<Callback> = [];

    for (const dep of this.deps) {
      untrackers.push(dep.__on(subscriber));
    }

    return () => untrackers.forEach(x => x());
  }

  __trackSelf() {
    this.deps.forEach(x => x.__trackSelf());
  }

  __getVersion() {
    let version = 0;

    for (const dep of this.deps) {
      version += dep.__getVersion();
    }

    return version;
  }

  private detectIsDirty() {
    for (const dep of this.deps) {
      if (!this.versions.has(dep) || this.versions.get(dep) !== dep.__getVersion()) return true;
    }

    return false;
  }

  private compute() {
    const prevContext = getContext();

    setContext(this);

    try {
      this.deps.clear();
      this.versions.clear();
      this.value = this.selector();
    } catch (error) {
      throwThis(error);
    } finally {
      this.deps.forEach(x => this.versions.set(x, x.__getVersion()));
      setContext(prevContext);
    }

    return this.value;
  }
}

const computed = <T>(selector: Selector<T>) => new Computed(selector);

export { Computed, computed };
