import { platform } from '../platform';
import { detectIsFunction, trueFn } from '../helpers';
import { Fiber } from '../fiber';
import { createUpdateCallback } from '../workloop';
import { scope$$, getRootId } from '../scope';
import { useMemo } from '../use-memo';

type ShouldUpdate<T> = (p: T, n: T) => boolean;

class Atom<T = unknown> {
  private value$: T;
  private subs: Map<Fiber, ShouldUpdate<T>> = new Map();

  constructor(value: T) {
    this.value$ = value;
  }

  value(fn?: ShouldUpdate<T>) {
    link(scope$$().getCursorFiber(), this.subs, fn);

    return this.value$;
  }

  get() {
    return this.value$;
  }

  set(value: T | ((prevValue: T) => T)) {
    const rootId = getRootId();
    const value$ = this.value$;

    this.value$ = detectIsFunction(value) ? value(value$) : value;

    for (const [fiber, shouldUpdate = trueFn] of this.subs) {
      if (!shouldUpdate(value$, this.value$)) continue;
      platform.schedule(createUpdateCallback({ rootId, fiber }), { forceSync: true });
    }
  }

  reset(value?: T) {
    this.value$ = value;
    this.subs = new Map();
  }
}

const atom = <T>(value?: T) => new Atom(value);

const detectIsAtom = (value: unknown): value is Atom => value instanceof Atom;

function link<T>(fiber: Fiber, subs: Map<Fiber, ShouldUpdate<T>>, fn: ShouldUpdate<T>) {
  subs.set(fiber, fn) && (fiber.cleanup = () => subs.delete(fiber));
}

function useAtom<T>(value?: T): [Atom<T>, (value: T | ((prevValue: T) => T)) => void] {
  const atom$ = useMemo(() => atom(value), []);

  return [atom$, (...args) => atom$.set(...args)];
}

export { Atom, atom, detectIsAtom, useAtom };
