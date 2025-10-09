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

  get(): T {
    this.__trackSelf();
    return this.detectIsDirty() ? this.compute() : this.value;
  }

  __add(x: AbstractSignal<unknown>) {
    this.deps.add(x);
  }

  __on(subscriber: Subscriber): Callback {
    const untrackers: Array<Callback> = [];

    for (const dep of this.deps) {
      untrackers.push(dep.__on(subscriber));
    }

    return () => untrackers.forEach(x => x());
  }

  __trackSelf() {
    this.deps.forEach(x => x.__trackSelf());
  }

  __getVersion(): number {
    let version = 0;

    for (const dep of this.deps) {
      version += dep.__getVersion();
    }

    return version;
  }

  private detectIsDirty(): boolean {
    for (const dep of this.deps) {
      if (!this.versions.has(dep) || this.versions.get(dep) !== dep.__getVersion()) return true;
    }

    return false;
  }

  private compute(): T {
    const prevContext = getContext();

    try {
      setContext(this);
      this.deps.clear();
      this.versions.clear();
      this.value = this.selector();
    } catch (error) {
      throwThis(error);
    } finally {
      try {
        this.deps.forEach(x => this.versions.set(x, x.__getVersion()));
      } catch (error) {
        throwThis(error);
      } finally {
        setContext(prevContext);
      }
    }

    return this.value;
  }
}

const computed = <T>(selector: Selector<T>) => new Computed(selector);

export { Computed, computed };
