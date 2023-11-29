import { type SubscriberWithValue } from '../shared';
import { detectIsFunction, detectIsEmpty, trueFn } from '../helpers';
import { createUpdateCallback } from '../workloop';
import { scope$$, getRootId } from '../scope';
import { EventEmitter } from '../emitter';
import { platform } from '../platform';
import { useMemo } from '../use-memo';
import { type Hook } from '../fiber';

class Atom<T = unknown> {
  private x: T;
  private connections1: Map<Hook, Tuple<T>>;
  private connections2: Map<T, Tuple<T>>;
  private emitter: EventEmitter;

  constructor(value: T) {
    this.x = value;
  }

  value(fn?: ShouldUpdate<T>, key?: T) {
    this.connect(fn, key);

    return this.x;
  }

  get() {
    return this.x;
  }

  set(value: T | ((prevValue: T) => T)) {
    const p = this.x;
    const n = detectIsFunction(value) ? value(this.x) : value;
    const make = (t: Tuple<T>, p: T, n: T) => {
      const [rootId, hook, shouldUpdate = trueFn] = t;

      shouldUpdate(p, n, n) && platform.schedule(createUpdateCallback({ rootId, hook }));
    };

    this.x = n;

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

    this.emitter && this.emitter.emit('data', this.x);
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
  }

  getSize() {
    const size1 = this.connections1 ? this.connections1.size : 0;
    const size2 = this.connections2 ? this.connections2.size : 0;

    return size1 + size2;
  }

  toString() {
    return String(this.x);
  }

  toJSON() {
    return this.x;
  }

  valueOf() {
    return this.x;
  }

  private off(hook: Hook, key: T) {
    hook.owner.atoms.delete(this);
    this.connections1 && this.connections1.delete(hook);
    this.connections2 && this.connections2.delete(key);
  }
}

const atom = <T>(value?: T) => new Atom(value);

const detectIsAtom = (value: unknown): value is Atom => value instanceof Atom;

function useAtom<T>(value?: T): Atom<T> {
  return useMemo(() => atom<T>(value), []);
}

type ShouldUpdate<T> = (p: T, n: T, key?: T) => boolean;

type Tuple<T> = [number, Hook, ShouldUpdate<T>, T];

export { Atom, atom, detectIsAtom, useAtom };
