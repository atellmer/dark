import { platform } from '../platform';
import { detectIsFunction } from '../helpers';
import { Fiber, createUpdateCallback } from '../fiber';
import { currentFiberStore, getRootId } from '../scope';

type ShouldUpdate<T> = (p: T, n: T) => boolean;

class Atom<T = unknown> {
  private value$: T;
  private subs: Map<Fiber, ShouldUpdate<T>> = new Map();

  constructor(value: T) {
    this.value$ = value;
  }

  value(shouldUpdate?: ShouldUpdate<T>) {
    const fiber = currentFiberStore.get();

    this.subs.set(fiber, shouldUpdate);
    fiber.cleanup = () => this.subs.delete(fiber);

    return this.value$;
  }

  get() {
    return this.value$;
  }

  set(value: T | ((prevValue: T) => T)) {
    const rootId = getRootId();
    const value$ = this.value$;

    this.value$ = detectIsFunction(value) ? value(value$) : value;

    for (const [fiber, shouldUpdate = shouldUpdate$] of this.subs) {
      if (!shouldUpdate(value$, this.value$)) continue;
      platform.schedule(createUpdateCallback({ rootId, fiber }), { forceSync: true });
    }
  }
}

const atom = <T>(value?: T) => new Atom(value);

const shouldUpdate$ = () => true;

const detectIsAtom = (value: unknown): value is Atom => value instanceof Atom;

export { Atom, atom, detectIsAtom };
