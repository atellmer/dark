import { type SubscriberWithValue, type Callback } from '../shared';
import { detectIsFunction, detectIsEmpty, trueFn } from '../helpers';
import { useLayoutEffect } from '../use-layout-effect';
import { createUpdate } from '../workloop';
import { scope$$, getRootId } from '../scope';
import { EventEmitter } from '../emitter';
import { platform } from '../platform';
import { useMemo } from '../use-memo';
import { type Hook } from '../fiber';
import { error } from '../helpers';

class Atom<T = unknown> {
  private value: T;
  private connections1: Map<Hook, Tuple<T>>;
  private connections2: Map<T, Tuple<T>>;
  private emitter: EventEmitter<EmitterValue<T>>;

  constructor(value: T) {
    this.value = value;
  }

  val(fn?: ShouldUpdate<T>, key?: T) {
    try {
      this.connect(fn, key);
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') {
        error('[Dark]: Illegal invocation val() outside render process!');
      }
    }

    return this.value;
  }

  get() {
    return this.value;
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

  on(fn: SubscriberWithValue<EmitterValue<T>>) {
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
  }

  getSize() {
    const size1 = this.connections1 ? this.connections1.size : 0;
    const size2 = this.connections2 ? this.connections2.size : 0;

    return size1 + size2;
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

  protected setValue(value: T | ((prevValue: T) => T)) {
    const prev = this.value;
    const next = detectIsFunction(value) ? value(this.value) : value;
    const make = (tuple: Tuple<T>, prev: T, next: T) => {
      const [rootId, hook, shouldUpdate, key] = tuple;
      const fn = shouldUpdate || trueFn;

      fn(prev, next, key) && platform.schedule(createUpdate({ rootId, hook }));
    };

    this.value = next;

    if (this.connections1) {
      for (const [_, t] of this.connections1) {
        make(t, prev, next);
      }
    }

    if (this.connections2) {
      if (this.connections2.has(next)) {
        make(this.connections2.get(next), prev, next);
        this.connections2.has(prev) && make(this.connections2.get(prev), prev, next);
      }
    }

    this.emitter && this.emitter.emit('data', { prev, next });
  }

  private off(hook: Hook, key: T) {
    hook.owner.atoms.delete(this);
    this.connections1 && this.connections1.delete(hook);
    this.connections2 && this.connections2.delete(key);
  }
}

class WritableAtom<T = unknown> extends Atom<T> {
  set(value: T | ((prevValue: T) => T)) {
    super.setValue(value);
  }
}

class ReadableAtom<T = unknown> extends Atom<T> {
  private drops: Array<Callback> = [];

  constructor(deps$: Array<Atom>, fn: ComputedFn<T>) {
    const value = ReadableAtom.compute(deps$, fn);

    super(value);

    for (const dep$ of deps$) {
      this.drops.push(
        dep$.on(({ prev, next }) => {
          if (Object.is(prev, next)) return;
          const value = ReadableAtom.compute(deps$, fn);

          if (!Object.is(this.get(), value)) {
            super.setValue(value);
          }
        }),
      );
    }
  }

  override kill() {
    super.kill();
    this.drops && this.drops.forEach(x => x());
    this.drops = [];
  }

  private static compute<T>(deps$: Array<Atom>, fn: ComputedFn<T>) {
    return fn(...ReadableAtom.values(deps$));
  }

  private static values(deps$: Array<Atom>) {
    return deps$.map(x => x.get());
  }
}

const detectIsAtom = (value: unknown): value is Atom => value instanceof Atom;

const detectIsWritableAtom = (value: unknown): value is WritableAtom => value instanceof WritableAtom;

const detectIsReadableAtom = (value: unknown): value is ReadableAtom => value instanceof ReadableAtom;

const atom = <T>(value?: T) => new WritableAtom(value);

const computed = <T>(deps$: Array<Atom>, fn: ComputedFn<T>) => new ReadableAtom(deps$, fn);

function useAtom<T>(value?: T): WritableAtom<T> {
  const atom$ = useMemo(() => atom<T>(value), []);

  useLayoutEffect(() => () => atom$.kill(), []);

  return atom$;
}

function useComputed<T>(deps$: Array<Atom>, fn: ComputedFn<T>): ReadableAtom<T> {
  const atom$ = useMemo(() => computed(deps$, fn), []);

  useLayoutEffect(() => () => atom$.kill(), []);

  return atom$;
}

type ShouldUpdate<T> = (p: T, n: T, key?: T) => boolean;
type EmitterValue<T> = { prev: T; next: T };
type Tuple<T> = [number, Hook, ShouldUpdate<T>, T];
type ComputedFn<T> = (...args: Array<any>) => T;

export {
  type Atom,
  WritableAtom,
  ReadableAtom,
  detectIsAtom,
  detectIsWritableAtom,
  detectIsReadableAtom,
  atom,
  computed,
  useAtom,
  useComputed,
};
