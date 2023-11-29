import { type SubscriberWithValue, type Callback } from '../shared';
import { detectIsFunction, detectIsEmpty, trueFn } from '../helpers';
import { useLayoutEffect } from '../use-layout-effect';
import { createUpdate } from '../workloop';
import { scope$$, getRootId } from '../scope';
import { EventEmitter } from '../emitter';
import { platform } from '../platform';
import { useMemo } from '../use-memo';
import { type Hook } from '../fiber';

class Atom<T = unknown> {
  private value: T;
  private connections1: Map<Hook, Tuple<T>>;
  private connections2: Map<T, Tuple<T>>;
  private emitter: EventEmitter;
  private drops: Array<Callback>;

  constructor(value: T) {
    this.value = value;
  }

  val(fn?: ShouldUpdate<T>, key?: T) {
    this.connect(fn, key);

    return this.value;
  }

  get() {
    return this.value;
  }

  set(value: T | ((prevValue: T) => T)) {
    const p = this.value;
    const n = detectIsFunction(value) ? value(this.value) : value;
    const make = (t: Tuple<T>, p: T, n: T) => {
      const [rootId, hook, shouldUpdate] = t;
      const fn = shouldUpdate || trueFn;

      fn(p, n, n) && platform.schedule(createUpdate({ rootId, hook }));
    };

    this.value = n;

    if (this.connections1) {
      for (const [_, t] of this.connections1) {
        make(t, p, n);
      }
    }

    if (this.connections2) {
      if (this.connections2.has(n)) {
        make(this.connections2.get(n), p, n);
        this.connections2.has(p) && make(this.connections2.get(p), p, n);
      }
    }

    this.emitter && this.emitter.emit('data', this.value);
  }

  connect(fn: ShouldUpdate<T>, key: T) {
    const rootId = getRootId();
    const fiber = scope$$().getCursorFiber();
    const { hook } = fiber;
    const disconnect = () => this.off(hook, key);

    !fiber.atoms && (fiber.atoms = new Map());
    fiber.atoms.set(this, disconnect);
    fiber.markAtomHost();

    if (detectIsEmpty(key)) {
      !this.connections1 && (this.connections1 = new Map());
      this.connections1.set(hook, [rootId, hook, fn, key]);
    } else {
      !this.connections2 && (this.connections2 = new Map());
      this.connections2.set(key, [rootId, hook, fn, key]);
    }

    return disconnect;
  }

  on(fn: SubscriberWithValue<T>) {
    !this.emitter && (this.emitter = new EventEmitter());

    return this.emitter.on('data', fn);
  }

  kill() {
    if (this.connections1) {
      for (const [hook, [_, __, ___, key]] of this.connections1) {
        this.off(hook, key);
      }
    }

    if (this.connections2) {
      for (const [key, [_, hook]] of this.connections2) {
        this.off(hook, key);
      }
    }

    this.connections1 = null;
    this.connections2 = null;
    this.emitter = null;
    this.drops && this.drops.forEach(x => x());
    this.drops = null;
  }

  getSize() {
    const size1 = this.connections1 ? this.connections1.size : 0;
    const size2 = this.connections2 ? this.connections2.size : 0;

    return size1 + size2;
  }

  setDrops(drops: Array<Callback>) {
    this.drops = drops;
  }

  toString() {
    return String(this.value);
  }

  toJSON() {
    return this.value;
  }

  valueOf() {
    return this.value;
  }

  private off(hook: Hook, key: T) {
    hook.owner.atoms.delete(this);
    this.connections1 && this.connections1.delete(hook);
    this.connections2 && this.connections2.delete(key);
  }
}

const atom = <T>(value?: T) => new Atom(value);

const detectIsAtom = (value: unknown): value is Atom => value instanceof Atom;

const values = (atoms$: Array<Atom>) => atoms$.map(x => x.get());

const compute = <T>(atoms$: Array<Atom>, fn: ComputedFn<T>) => fn(...values(atoms$));

function computed<T>(deps$: Array<Atom>, fn: ComputedFn<T>) {
  const atom$ = atom(compute(deps$, fn));
  const drops: Array<Callback> = [];

  for (const dep$ of deps$) {
    drops.push(
      dep$.on(() => {
        const value = compute(deps$, fn);

        if (!Object.is(atom$.get(), value)) {
          atom$.set(value);
        }
      }),
    );
  }

  atom$.setDrops(drops);

  return atom$;
}

function useAtom<T>(value?: T): Atom<T> {
  const atom$ = useMemo(() => atom<T>(value), []);

  useLayoutEffect(() => () => atom$.kill(), []);

  return atom$;
}

function useComputed<T>(deps$: Array<Atom>, fn: (...args: Array<any>) => T): Atom<T> {
  const atom$ = useMemo(() => computed(deps$, fn), []);

  useLayoutEffect(() => () => atom$.kill(), []);

  return atom$;
}

type ShouldUpdate<T> = (p: T, n: T, key?: T) => boolean;

type Tuple<T> = [number, Hook, ShouldUpdate<T>, T];

type ComputedFn<T> = (...args: Array<any>) => T;

export { Atom, atom, detectIsAtom, computed, useAtom, useComputed };
