import { platform } from '../platform';
import { detectIsFunction } from '../helpers';
import { Fiber, createUpdateCallback } from '../fiber';
import { currentFiberStore, getRootId } from '../scope';

type ShouldUpdate<T> = (p: T, n: T) => boolean;

class Signal<T = unknown> {
  private value: T;
  private subs: Map<Fiber, ShouldUpdate<T>> = new Map();

  constructor(value: T) {
    this.value = value;
  }

  get(shouldUpdate?: ShouldUpdate<T>) {
    const fiber = currentFiberStore.get();

    this.subs.set(fiber, shouldUpdate);
    fiber.cleanup = () => this.subs.delete(fiber);

    return this.value;
  }

  set(value: T | ((prevValue: T) => T)) {
    const rootId = getRootId();
    const value$ = this.value;

    this.value = detectIsFunction(value) ? value(value$) : value;

    for (const [fiber, shouldUpdate = shouldUpdate$] of this.subs) {
      if (!shouldUpdate(value$, this.value)) continue;
      platform.schedule(createUpdateCallback({ rootId, fiber }), { forceSync: true });
    }
  }
}

const signal = <T>(value?: T) => new Signal(value);

const shouldUpdate$ = () => true;

const detectIsSignal = (value: unknown): value is Signal => value instanceof Signal;

export { Signal, signal, detectIsSignal };
