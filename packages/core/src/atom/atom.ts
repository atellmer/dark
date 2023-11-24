import { type Hook } from '../fiber';
import { type Callback } from '../shared';
import { platform } from '../platform';
import { detectIsFunction, trueFn } from '../helpers';
import { createUpdateCallback } from '../workloop';
import { scope$$, getRootId } from '../scope';
import { useMemo } from '../use-memo';

class Atom<T = unknown> {
  private x: T;
  private subs: Map<Hook, Subscriber<T>> = new Map();
  private unsubs: Map<Hook, Callback> = new Map();

  constructor(value: T) {
    this.x = value;
  }

  value(shouldUpdate: ShouldUpdate<T> = trueFn) {
    const rootId = getRootId();
    const fiber = scope$$().getCursorFiber();
    const { hook } = fiber;

    this.on(hook, (p, n) => {
      shouldUpdate(p, n) && platform.schedule(createUpdateCallback({ rootId, getFiber: () => hook.getOwner() }));
    });

    return this.x;
  }

  get() {
    return this.x;
  }

  set(value: T | ((prevValue: T) => T)) {
    const p = this.x;
    const n = detectIsFunction(value) ? value(this.x) : value;

    this.x = n;

    for (const [_, fn] of this.subs) {
      fn(p, n);
    }
  }

  on(hook: Hook, fn: Subscriber<T>) {
    const fiber = hook.getOwner();
    const off = () => this.unsubs.has(hook) && this.unsubs.get(hook)();

    fiber.markAtomHost();
    this.subs.set(hook, fn);
    this.unsubs.set(hook, () => {
      const fiber = hook.getOwner();

      fiber.atoms.delete(this);
      this.subs.delete(hook);
      this.unsubs.delete(hook);
    });

    !fiber.atoms && (fiber.atoms = new Map());
    fiber.atoms.set(this, off);

    return off;
  }

  reset(value?: T) {
    this.x = value;
    this.subs = new Map();
    this.unsubs.forEach(x => x());
    this.unsubs = new Map();
  }

  toString() {
    return String(this.x);
  }

  toJSON() {
    return this.x;
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

type Subscriber<T> = (p: T, n: T) => void;

type SetAtom<T = unknown> = (value: T | ((prevValue: T) => T)) => void;

export { Atom, atom, detectIsAtom, useAtom };
