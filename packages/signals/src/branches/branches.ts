import { Callback } from '@dark-engine/core';
import { type AbstractSignal } from '../abstract-signal';
import { type Signal } from '../signal';
import { effect } from '@dark-engine/signals/effect';

class Branches<T> {
  private signal$: AbstractSignal<T>;
  private dispose: Callback;
  private prev: T | undefined;
  private map = new Map<T, Signal<T | undefined>>();

  constructor(signal$: AbstractSignal<T>) {
    this.signal$ = signal$;
  }

  actual(): T {
    return this.signal$.peek();
  }

  set(key: T, signal$: Signal<T>) {
    this.map.set(key, signal$);
  }

  delete(key: T) {
    this.map.delete(key);
  }

  attach() {
    this.dispose = effect(() => {
      const next = this.signal$.get();
      const prev$ = this.map.get(this.prev);
      const next$ = this.map.get(next);

      prev$?.set(undefined);
      next$?.set(next);
      this.prev = next;
    });
  }

  detach() {
    this.dispose?.();
  }
}

const branches = <T>(signal$: AbstractSignal<T>) => new Branches(signal$);

export { Branches, branches };
