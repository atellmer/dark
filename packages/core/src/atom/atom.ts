import { type Callback, type SubscriberWithValue } from '../shared';
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
  private drops: Map<Hook, Callback>;
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
    const off = () => this.drops.has(hook) && this.drops.get(hook)();

    !fiber.atoms && (fiber.atoms = new Map());
    fiber.atoms.set(this, off);
    fiber.markAtomHost();

    if (detectIsEmpty(key)) {
      !this.connections1 && (this.connections1 = new Map());
      this.connections1.set(hook, [rootId, hook, fn]);
    } else {
      !this.connections2 && (this.connections2 = new Map());
      this.connections2.set(key, [rootId, hook, fn]);
    }

    !this.drops && (this.drops = new Map());
    this.drops.set(hook, () => {
      hook.owner.atoms.delete(this);
      this.connections1 && this.connections1.delete(hook);
      this.connections2 && this.connections2.delete(key);
      this.drops.delete(hook);
    });

    return off;
  }

  on(fn: SubscriberWithValue<T>) {
    !this.emitter && (this.emitter = new EventEmitter());

    return this.emitter.on('data', fn);
  }

  kill() {
    this.drops.forEach(x => x());
    this.drops = null;
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
}

const atom = <T>(value?: T) => new Atom(value);

const detectIsAtom = (value: unknown): value is Atom => value instanceof Atom;

function useAtom<T>(value?: T): Atom<T> {
  return useMemo(() => atom<T>(value), []);
}

type ShouldUpdate<T> = (p: T, n: T, key?: T) => boolean;

type Tuple<T> = [number, Hook, ShouldUpdate<T>];

export { Atom, atom, detectIsAtom, useAtom };
