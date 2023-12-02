import { detectIsFunction, detectIsEmpty, detectAreDepsDifferent, trueFn, error } from '../helpers';
import { useLayoutEffect } from '../use-layout-effect';
import { type SubscriberWithValue } from '../shared';
import { MASK_ATOM_HOST } from '../constants';
import { $$scope, getRootId } from '../scope';
import { createUpdate } from '../workloop';
import { useUpdate } from '../use-update';
import { EventEmitter } from '../emitter';
import { platform } from '../platform';
import { useMemo } from '../use-memo';
import { type Hook } from '../fiber';
import { batch } from '../batch';

class Atom<T = unknown> {
  private value: T;
  private connections1: Map<Hook, Tuple<T>>;
  private connections2: Map<T, Tuple<T>>;
  private subjects: Set<ReadableAtom>;
  private emitter: EventEmitter<EmitterValue<T>>;

  constructor(value: T) {
    this.value = value;
  }

  val(fn?: ShouldUpdate<T>, key?: T) {
    try {
      this.__connect(fn, key);
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') {
        error('[Dark]: Illegal invocation atom.val() outside render process!');
      }
    }

    return this.value;
  }

  get() {
    return this.value;
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
    this.subjects = null;
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

  __connect(fn: ShouldUpdate<T>, key: T) {
    const rootId = getRootId();
    const fiber = $$scope().getCursorFiber();
    const { hook } = fiber;
    const disconnect = () => this.off(hook, key);

    !fiber.atoms && (fiber.atoms = new Map());
    fiber.atoms.set(this, disconnect);
    fiber.markHost(MASK_ATOM_HOST);

    if (detectIsEmpty(key)) {
      !this.connections1 && (this.connections1 = new Map());
      this.connections1.set(hook, [rootId, hook, fn, key]);
    } else {
      !this.connections2 && (this.connections2 = new Map());
      this.connections2.set(key, [rootId, hook, fn, key]);
    }

    return disconnect;
  }

  __addSubject(atom$: ReadableAtom) {
    !this.subjects && (this.subjects = new Set());
    this.subjects.add(atom$);
  }

  __removeSubject(atom$: ReadableAtom) {
    return this.subjects && this.subjects.delete(atom$);
  }

  __getSize() {
    const size1 = this.connections1 ? this.connections1.size : 0;
    const size2 = this.connections2 ? this.connections2.size : 0;
    const size3 = this.subjects ? this.subjects.size : 0;
    const size4 = this.emitter ? this.emitter.__getSize() : 0;

    return size1 + size2 + size3 + size4;
  }

  protected setValue(value: T | ((prevValue: T) => T)) {
    const prev = this.value;
    const next = detectIsFunction(value) ? value(this.value) : value;
    const data: EmitterValue<T> = { prev, next };
    const make = (tuple: Tuple<T>, prev: T, next: T) => {
      const [rootId, hook, shouldUpdate, key] = tuple;
      const fn = shouldUpdate || trueFn;

      fn(prev, next, key) && platform.schedule(createUpdate({ rootId, hook }));
    };

    this.value = next;

    if (this.connections1) {
      for (const [_, tuple] of this.connections1) {
        make(tuple, prev, next);
      }
    }

    if (this.connections2) {
      if (this.connections2.has(next)) {
        make(this.connections2.get(next), prev, next);
        this.connections2.has(prev) && make(this.connections2.get(prev), prev, next);
      }
    }

    this.emitter && this.emitter.emit('data', data);
    this.subjects && this.subjects.forEach(x => x.__notify());
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
  private deps$: Array<Atom> = [];
  private fn: ComputedFn<T> = null;
  private values: Array<unknown> = [];

  constructor(deps$: Array<Atom>, fn: ComputedFn<T>) {
    const values = ReadableAtom.values(deps$);

    super(ReadableAtom.compute(fn, values));
    this.deps$ = deps$;
    this.fn = fn;
    this.values = values;
    deps$.forEach(x => x.__addSubject(this));
  }

  __notify() {
    const values = ReadableAtom.values(this.deps$);

    if (detectAreDepsDifferent(this.values, values)) {
      super.setValue(ReadableAtom.compute(this.fn, values));
    }

    this.values = values;
  }

  override kill() {
    super.kill();
    this.deps$.forEach(x => x.__removeSubject(this));
    this.deps$ = [];
    this.fn = null;
  }

  private static compute(fn: Function, values: Array<unknown>) {
    return fn(...values);
  }

  private static values(deps$: Array<Atom>) {
    return deps$.map(x => x.get());
  }
}

const detectIsAtom = (value: unknown): value is Atom => value instanceof Atom;

const detectIsWritableAtom = (value: unknown): value is WritableAtom => value instanceof WritableAtom;

const detectIsReadableAtom = (value: unknown): value is ReadableAtom => value instanceof ReadableAtom;

const atom = <T>(value?: T) => new WritableAtom(value);

const computed = <T, A, B, C, D, E, F, G, H, I, J, K, L, M, N>(
  deps$: [
    Atom<A>,
    Atom<B>?,
    Atom<C>?,
    Atom<D>?,
    Atom<E>?,
    Atom<F>?,
    Atom<G>?,
    Atom<H>?,
    Atom<I>?,
    Atom<J>?,
    Atom<K>?,
    Atom<L>?,
    Atom<M>?,
    Atom<N>?,
  ],
  fn: ComputedFn<T, A, B, C, D, E, F, G, H, I, J, K, L, M, N>,
) => new ReadableAtom(deps$, fn) as ReadableAtom<ReturnType<typeof fn>>;

function useAtom<T>(value?: T): WritableAtom<T> {
  const atom$ = useMemo(() => atom<T>(value), []);

  useLayoutEffect(() => () => atom$.kill(), []);

  return atom$;
}

function useComputed<T, A, B, C, D, E, F, G, H, I, J, K, L, M, N>(
  deps$: [
    Atom<A>,
    Atom<B>?,
    Atom<C>?,
    Atom<D>?,
    Atom<E>?,
    Atom<F>?,
    Atom<G>?,
    Atom<H>?,
    Atom<I>?,
    Atom<J>?,
    Atom<K>?,
    Atom<L>?,
    Atom<M>?,
    Atom<N>?,
  ],
  fn: ComputedFn<T, A, B, C, D, E, F, G, H, I, J, K, L, M, N>,
) {
  const atom$ = useMemo(() => computed(deps$, fn), []);

  useLayoutEffect(() => () => atom$.kill(), []);

  return atom$;
}

function useStore<A, B, C, D, E, F, G, H, I, J, K, L, M, N>(
  atom$s: [
    Atom<A>,
    Atom<B>?,
    Atom<C>?,
    Atom<D>?,
    Atom<E>?,
    Atom<F>?,
    Atom<G>?,
    Atom<H>?,
    Atom<I>?,
    Atom<J>?,
    Atom<K>?,
    Atom<L>?,
    Atom<M>?,
    Atom<N>?,
  ],
) {
  const forceUpdate = useUpdate();
  const update = () => batch(forceUpdate);

  useLayoutEffect(() => {
    const offs = atom$s.map(x => x.on(update));

    return () => offs.forEach(x => x());
  }, [...atom$s]);

  return atom$s.map(x => x.get()) as [A, B, C, D, E, F, G, H, I, J, K, L, M, N];
}

type ShouldUpdate<T> = (p: T, n: T, key?: T) => boolean;
type EmitterValue<T> = { prev: T; next: T };
type Tuple<T> = [number, Hook, ShouldUpdate<T>, T];
type ComputedFn<
  T,
  A = unknown,
  B = unknown,
  C = unknown,
  D = unknown,
  E = unknown,
  F = unknown,
  G = unknown,
  H = unknown,
  I = unknown,
  J = unknown,
  K = unknown,
  L = unknown,
  M = unknown,
  N = unknown,
> = (a: A, b?: B, c?: C, d?: D, e?: E, f?: F, g?: G, h?: H, i?: I, j?: J, k?: K, l?: L, m?: M, n?: N) => T;

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
  useStore,
};
