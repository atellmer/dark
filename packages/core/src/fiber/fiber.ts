import {
  IS_WIP_HOOK_MASK,
  IS_PORTAL_HOOK_MASK,
  IS_SUSPENSE_HOOK_MASK,
  IS_BOUNDARY_HOOK_MASK,
  IS_PENDING_HOOK_MASK,
} from '../constants';
import { detectIsFunction, detectIsUndefined, logError } from '../utils';
import { type Instance, type Callback, type TimerId } from '../shared';
import { detectAreSameComponentTypesWithSameKeys } from '../view';
import { type Context, type ContextProvider } from '../context';
import { detectIsComponent } from '../component';
import { type Atom } from '../atom';

class Fiber<N = NativeElement> {
  id = 0;
  cc = 0; // child fibers count
  cec = 0; // child native elements count
  idx = 0; // idx of fiber in the parent fiber
  eidx = 0; // native element idx
  mask = 0; // bit mask
  element: N = null; // native element
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

    if (!this.parent.element && !this.parent.hook?.getIsWip()) {
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
  atoms: Map<Atom, Callback> = null;
  mask = 0;
  box?: Box = null;

  __getMask(mask: number) {
    return Boolean(this.mask & mask);
  }

  __mark(mask: number, x: boolean) {
    x ? (this.mask |= mask) : (this.mask &= ~mask);
  }

  __box() {
    if (!this.box) this.box = {};
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
    return this.box?.providers;
  }

  setProviders(x: Map<Context, ContextProvider>) {
    this.__box();
    this.box.providers = x;
  }

  getBatch() {
    return this.box?.batch;
  }

  setBatch(x: Batch) {
    this.__box();
    this.box.batch = x;
  }

  hasCatch() {
    return detectIsFunction(this.box?.catch);
  }

  setCatch(x: Catch) {
    this.__box();
    this.box.catch = x;
  }

  catch(x: Error) {
    this.box?.catch(x);
  }

  setUpdate(x: Callback) {
    this.__box();
    this.box.update = x;
  }

  update() {
    this.box?.update();
  }

  incrementPending() {
    this.__box();
    detectIsUndefined(this.box.pendings) && (this.box.pendings = 0);
    this.box.pendings++;
  }

  getPendings() {
    return this.box?.pendings;
  }

  setResId(x: number) {
    this.__box();
    this.box.resId = x;
  }

  getResId() {
    return this.box?.resId;
  }

  setLevel(x: number) {
    this.__box();
    this.box.level = x;
  }

  getLevel() {
    return this.box?.level;
  }
}

function getHook(alt: Fiber, prevInst: Instance, nextInst: Instance): Hook | null {
  if (alt && detectAreSameComponentTypesWithSameKeys(prevInst, nextInst)) return alt.hook;
  if (detectIsComponent(nextInst)) return new Hook();

  return null;
}

type Box = {
  providers?: Map<Context, ContextProvider>;
  batch?: Batch;
  catch?: Catch;
  pendings?: number;
  update?: Callback;
  resId?: number;
  level?: number;
};

type Batch = {
  timer: TimerId;
  changes: Array<Callback>;
};

type Catch = (e: Error) => void;

export type NativeElement = unknown;
export type HookValue<T = any> = { deps: Array<any>; value: T };

export { Fiber, Hook, getHook };
