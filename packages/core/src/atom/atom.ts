import { type Hook } from '../fiber';
import { platform } from '../platform';
import { detectIsFunction, trueFn } from '../helpers';
import { createUpdateCallback } from '../workloop';
import { scope$$, getRootId } from '../scope';
import { useMemo } from '../use-memo';

class Atom<T = unknown> {
  private value$: T;
  private subs: Map<Hook, ShouldUpdate<T>> = new Map();

  constructor(value: T) {
    this.value$ = value;
  }

  value(fn?: ShouldUpdate<T>) {
    const fiber = scope$$().getCursorFiber();

    fiber.markAtomHost();
    this.on(fiber.hook, fn);

    return this.value$;
  }

  get() {
    return this.value$;
  }

  set(value: T | ((prevValue: T) => T)) {
    const rootId = getRootId();
    const value$ = this.value$;

    this.value$ = detectIsFunction(value) ? value(value$) : value;

    for (const [hook, shouldUpdate = trueFn] of this.subs) {
      if (!shouldUpdate(value$, this.value$)) continue;
      platform.schedule(createUpdateCallback({ rootId, getFiber: () => hook.getOwner() }));
    }
  }

  reset(value?: T) {
    this.value$ = value;
    this.subs = new Map();
  }

  toString() {
    return String(this.value$);
  }

  toJSON() {
    return this.value$;
  }

  private on(hook: Hook, fn: ShouldUpdate<T>) {
    const fiber = hook.getOwner();

    this.subs.set(hook, fn);

    !fiber.atoms && (fiber.atoms = new Map());
    fiber.atoms.set(this, () => this.subs.delete(hook));
  }
}

const atom = <T>(value?: T) => new Atom(value);

const detectIsAtom = (value: unknown): value is Atom => value instanceof Atom;

function useAtom<T>(value?: T): [Atom<T>, SetAtom<T>] {
  const [atom$, setAtom] = useMemo(() => {
    const atom$ = atom<T>(value);
    const setAtom = atom$.set.bind(atom$) as SetAtom<T>;

    return [atom$, setAtom];
  }, []);

  return [atom$, setAtom];
}

type ShouldUpdate<T> = (p: T, n: T) => boolean;

type SetAtom<T = unknown> = (value: T | ((prevValue: T) => T)) => void;

export { Atom, atom, detectIsAtom, useAtom };
