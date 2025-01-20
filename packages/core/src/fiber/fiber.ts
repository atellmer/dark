import {
  EFFECT_HOST_MASK,
  IS_WIP_HOOK_MASK,
  IS_PORTAL_HOOK_MASK,
  IS_SUSPENSE_HOOK_MASK,
  IS_BOUNDARY_HOOK_MASK,
  IS_PENDING_HOOK_MASK,
} from '../constants';
import { type Instance, type Callback, type TimerId } from '../shared';
import { detectAreSameComponentTypesWithSameKeys } from '../view';
import { type UseEffectValue, dropEffects } from '../use-effect';
import { type Context, type ContextProvider } from '../context';
import { detectIsFunction, logError } from '../utils';
import { detectIsComponent } from '../component';
import { type Atom } from '../atom';

class Fiber<N = NativeElement> {
  id = 0;
  cc = 0; // child fibers count
  cec = 0; // child native elements count
  idx = 0; // idx of fiber in the parent fiber
  eidx = 0; // native element idx
  mask = 0; // bit mask
  el: N = null; // native element
  tag: string = null; // effect tag (CREATE, UPDATE, DELETE, SKIP)
  parent: Fiber<N> = null; // parent fiber
  child: Fiber<N> = null; // child fiber
  next: Fiber<N> = null; // next sibling fiber
  alt: Fiber<N> = null; // alternate fiber (previous)
  inst: Instance = null; // instance of component or virtual node
  hook: Hook | null = null; // hook

  constructor(idx = 0, hook: Hook = null) {
    this.id = Fiber.incrementId();
    this.idx = idx;
    this.hook = hook;
  }

  mutate(fiber: Partial<Fiber<N>>) {
    for (const key in fiber) {
      this[key] = fiber[key];
    }

    return this;
  }

  markHost(mask: number) {
    this.mask |= mask;
    this.parent && !(this.parent.mask & mask) && this.parent.markHost(mask);
  }

  increment(count = 1) {
    if (!this.parent) return;
    this.parent.cec += count;

    if (!this.parent.el && !this.parent.hook?.getIsWip()) {
      this.parent.increment(count);
    }
  }

  setError(err: Error) {
    if (this.hook?.hasCatch()) {
      this.hook.catch(err);
      logError(err);
    } else if (this.parent) {
      this.parent.setError(err);
    } else {
      throw err;
    }
  }

  static incrementId() {
    return ++Fiber.nextId;
  }

  static setNextId(id: number) {
    Fiber.nextId = id;
  }

  private static nextId = 0;
}

class Hook<T = unknown> {
  idx = 0;
  values: Array<T> = [];
  owner: Fiber = null;
  mask = 0;
  providers: Map<Context, ContextProvider> = null;
  atoms: Map<Atom, Callback> = null;
  batch: Batch = null;
  catch: Catch = null;
  pendings = 0;
  update: Callback = null;

  __getMask(mask: number) {
    return Boolean(this.mask & mask);
  }

  __mark(mask: number, x: boolean) {
    x ? (this.mask |= mask) : (this.mask &= ~mask);
  }

  getIsWip() {
    return this.__getMask(IS_WIP_HOOK_MASK);
  }

  setIsWip(x: boolean) {
    this.__mark(IS_WIP_HOOK_MASK, x);
  }

  getIsPortal() {
    return this.__getMask(IS_PORTAL_HOOK_MASK);
  }

  setIsPortal(x: boolean) {
    this.__mark(IS_PORTAL_HOOK_MASK, x);
  }

  getIsSuspense() {
    return this.__getMask(IS_SUSPENSE_HOOK_MASK);
  }

  setIsSuspense(x: boolean) {
    this.__mark(IS_SUSPENSE_HOOK_MASK, x);
  }

  getIsBoundary() {
    return this.__getMask(IS_BOUNDARY_HOOK_MASK);
  }

  setIsBoundary(x: boolean) {
    this.__mark(IS_BOUNDARY_HOOK_MASK, x);
  }

  getIsPending() {
    return this.__getMask(IS_PENDING_HOOK_MASK);
  }

  setIsPeinding(x: boolean) {
    this.__mark(IS_PENDING_HOOK_MASK, x);
  }

  getProviders() {
    return this.providers;
  }

  setProviders(x: Map<Context, ContextProvider>) {
    this.providers = x;
  }

  setAtom(atom: Atom, cb: Callback) {
    !this.atoms && (this.atoms = new Map());
    this.atoms.set(atom, cb);
  }

  removeAtom(atom: Atom) {
    this.atoms.delete(atom);
  }

  getBatch() {
    return this.batch;
  }

  setBatch(x: Batch) {
    this.batch = x;
  }

  hasCatch() {
    return detectIsFunction(this.catch);
  }

  setCatch(x: Catch) {
    this.catch = x;
  }

  setUpdate(x: Callback) {
    this.update = x;
  }

  incrementPendings() {
    this.pendings++;
  }

  getPendings() {
    return this.pendings;
  }

  drop() {
    const { atoms, values, owner } = this;

    if (values.length > 0 && owner.mask & EFFECT_HOST_MASK) {
      dropEffects(this as Hook<HookValue<UseEffectValue>>);
    }

    if (atoms) {
      for (const [_, cleanup] of atoms) cleanup();
      this.atoms = null;
    }
  }
}

function getHook(alt: Fiber, prevInst: Instance, nextInst: Instance): Hook | null {
  if (alt && detectAreSameComponentTypesWithSameKeys(prevInst, nextInst)) return alt.hook;
  if (detectIsComponent(nextInst)) return new Hook();

  return null;
}

type Batch = {
  timer: TimerId;
  changes: Array<Callback>;
};

type Catch = (e: Error) => void;

export type NativeElement = unknown;
export type HookValue<T = any> = { deps: Array<any>; value: T };

export { Fiber, Hook, getHook };
