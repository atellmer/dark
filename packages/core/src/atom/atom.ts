import { detectIsFunction, detectIsEmpty, detectAreDepsDifferent, trueFn, logError, formatErrorMsg } from '../utils';
import { createUpdate, useUpdate } from '../use-update';
import { useLayoutEffect } from '../use-layout-effect';
import { type SubscriberWithValue } from '../shared';
import { ATOM_HOST_MASK } from '../constants';
import { $$scope, getRootId } from '../scope';
import { createTools } from '../use-state';
import { EventEmitter } from '../emitter';
import { useMemo } from '../use-memo';
import { type Hook } from '../fiber';
import { batch } from '../batch';

class Atom<T = unknown> {
  private v: T; // value
  private c1: Map<Hook, Tuple<T>>; // connnections 1
  private c2: Map<T, Tuple<T>>; // connections 2
  private s: Set<ReadableAtom>; // subjects
  private e: EventEmitter<'data', EmitterValue<T>>;

  constructor(x: T) {
    this.v = x;
  }

  val(fn?: ShouldUpdate<T>, key?: T) {
    try {
      this.__connect(fn, key);
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') {
        logError(formatErrorMsg(`Illegal invocation atom.val() outside render process!`));
      }
    }

    return this.v;
  }

  get() {
    return this.v;
  }

  on(fn: SubscriberWithValue<EmitterValue<T>>) {
    !this.e && (this.e = new EventEmitter());
    return this.e.on('data', fn);
  }

  kill() {
    if (this.c1) {
      for (const [hook, [_, __, ___, key]] of this.c1) this.off(hook, key);
    }

    if (this.c2) {
      for (const [key, [_, hook]] of this.c2) this.off(hook, key);
    }

    this.c1 = null;
    this.c2 = null;
    this.e = null;
    this.s = null;
  }

  toString() {
    return String(this.v);
  }

  toJSON() {
    return this.v;
  }

  valueOf() {
    return this.v;
  }

  __connect(fn: ShouldUpdate<T>, key: T) {
    const rootId = getRootId();
    const fiber = $$scope().getCursor();
    const { hook } = fiber;

    !hook.atoms && (hook.atoms = new Map());
    hook.atoms.set(this, this.off.bind(this, hook, key));
    fiber.markHost(ATOM_HOST_MASK);

    if (detectIsEmpty(key)) {
      !this.c1 && (this.c1 = new Map());
      this.c1.set(hook, [rootId, hook, fn, key]);
    } else {
      !this.c2 && (this.c2 = new Map());
      this.c2.set(key, [rootId, hook, fn, key]);
    }
  }

  __addSubject(atom$: ReadableAtom) {
    !this.s && (this.s = new Set());
    this.s.add(atom$);
  }

  __removeSubject(atom$: ReadableAtom) {
    return this.s && this.s.delete(atom$);
  }

  __getSize() {
    const size1 = this.c1 ? this.c1.size : 0;
    const size2 = this.c2 ? this.c2.size : 0;
    const size3 = this.s ? this.s.size : 0;
    const size4 = this.e ? this.e.__getSize() : 0;

    return size1 + size2 + size3 + size4;
  }

  protected setValue(value: T | ((prevValue: T) => T)) {
    const prev = this.v;
    const next = detectIsFunction(value) ? value(this.v) : value;
    const data: EmitterValue<T> = { prev, next };
    const make = (tuple: Tuple<T>, prev: T, next: T) => {
      const [rootId, hook, shouldUpdate, key] = tuple;
      const fn = shouldUpdate || trueFn;

      if (fn(prev, next, key)) {
        const update = createUpdate(rootId, hook);

        if (this.__getSize() === 1) {
          const tools = createTools({
            next,
            get: () => prev,
            set: () => (this.v = next),
            reset: () => (this.v = prev),
          });

          update(tools);
        } else {
          update();
        }
      }
    };

    this.v = next;

    if (this.c1) {
      for (const [_, tuple] of this.c1) make(tuple, prev, next);
    }

    if (this.c2) {
      if (this.c2.has(next)) {
        make(this.c2.get(next), prev, next);
        this.c2.has(prev) && make(this.c2.get(prev), prev, next);
      }
    }

    this.e && this.e.emit('data', data);
    this.s && this.s.forEach(x => x.__notify());
  }

  private off(hook: Hook, key: T) {
    hook.atoms.delete(this);
    this.c1 && this.c1.delete(hook);
    this.c2 && this.c2.delete(key);
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

const detectIsAtom = (x: unknown): x is Atom => x instanceof Atom;

const detectIsWritableAtom = (x: unknown): x is WritableAtom => x instanceof WritableAtom;

const detectIsReadableAtom = (x: unknown): x is ReadableAtom => x instanceof ReadableAtom;

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
  atoms$: [
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
    const offs = atoms$.map(x => x.on(update));

    return () => offs.forEach(x => x());
  }, [...atoms$]);

  return atoms$.map(x => x.get()) as [A, B, C, D, E, F, G, H, I, J, K, L, M, N];
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
