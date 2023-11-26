import { type Callback, type SubscriberWithValue } from '../shared';
import { detectIsFunction, trueFn } from '../helpers';
import { createUpdateCallback } from '../workloop';
import { scope$$, getRootId } from '../scope';
import { EventEmitter } from '../emitter';
import { platform } from '../platform';
import { useMemo } from '../use-memo';
import { type Hook } from '../fiber';

class Atom<T = unknown> {
  private x: T;
  private connections: Map<Hook, [number, ShouldUpdate<T>, Args]> = new Map();
  private drops: Map<Hook, Callback> = new Map();
  private emitter: EventEmitter = null;

  constructor(value: T) {
    this.x = value;
  }

  value(fn?: ShouldUpdate<T>, ...args: Args) {
    this.connect(fn, args);

    return this.x;
  }

  get() {
    return this.x;
  }

  set(value: T | ((prevValue: T) => T)) {
    const p = this.x;
    const n = detectIsFunction(value) ? value(this.x) : value;

    this.x = n;

    for (const [hook, [rootId, shouldUpdate = trueFn, args]] of this.connections) {
      shouldUpdate(p, n, ...args) &&
        platform.schedule(createUpdateCallback({ rootId, getFiber: () => hook.getOwner() }));
    }

    this.emitter && this.emitter.emit('data', this.x);
  }

  connect(fn: ShouldUpdate<T>, args: Args) {
    const rootId = getRootId();
    const fiber = scope$$().getCursorFiber();
    const { hook } = fiber;
    const off = () => this.drops.has(hook) && this.drops.get(hook)();

    !fiber.atoms && (fiber.atoms = new Map());
    fiber.atoms.set(this, off);
    fiber.markAtomHost();

    this.connections.set(hook, [rootId, fn, args]);
    this.drops.set(hook, () => {
      hook.getOwner().atoms.delete(this);
      this.connections.delete(hook);
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
    this.drops = new Map();
    this.connections = new Map();
    this.emitter = null;
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

type ShouldUpdate<T> = (p: T, n: T, ...args: Args) => boolean;

type Args = Array<any>;

export { Atom, atom, detectIsAtom, useAtom };
