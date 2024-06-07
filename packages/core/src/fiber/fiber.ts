import {
  EFFECT_HOST_MASK,
  IS_WIP_HOOK_MASK,
  IS_PORTAL_HOOK_MASK,
  IS_SUSPENSE_HOOK_MASK,
  IS_PENDING_HOOK_MASK,
} from '../constants';
import { detectIsFunction, detectIsUndefined, logError } from '../utils';
import { type Instance, type Callback, type TimerId } from '../shared';
import { detectAreSameComponentTypesWithSameKeys } from '../view';
import { type Context, type ContextProvider } from '../context';
import { detectIsComponent } from '../component';
import { dropEffects } from '../use-effect';

class Fiber<N = NativeElement> {
  id = 0;
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
    for (const key in fiber) this[key] = fiber[key];
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
    if (this.hook?.hasCatcher()) {
      this.hook.catch(err);
      logError(err);
    } else if (this.parent) {
      this.parent.setError(err);
    } else {
      throw err;
    }
  }

  drop() {
    const hook = this.hook as Hook<HookValue>;
    const values = hook?.values;
    const signals = hook?.getSignals();

    values && values.length > 0 && this.mask & EFFECT_HOST_MASK && dropEffects(hook);

    if (signals) {
      for (const [_, dropSignal] of signals) dropSignal();
      hook.resetSignals();
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
  values: Array<T> = null;
  owner: Fiber = null;
  mask = 0;

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

  getIsPending() {
    return this.__getMask(IS_PENDING_HOOK_MASK);
  }

  setIsPeinding(x: boolean) {
    this.__mark(IS_PENDING_HOOK_MASK, x);
  }

  getProviders() {
    return this[PROVIDERS] as Map<Context, ContextProvider>;
  }

  setProviders(x: Map<Context, ContextProvider>) {
    this[PROVIDERS] = x;
  }

  getBatcher() {
    return this[BATCHER] as Batcher;
  }

  setBatcher(x: Batcher) {
    this[BATCHER] = x;
  }

  hasCatcher() {
    return detectIsFunction(this[CATCHER]);
  }

  setCatcher(x: Catcher) {
    this[CATCHER] = x;
  }

  catch(x: Error) {
    this?.[CATCHER](x);
  }

  incrementPending() {
    detectIsUndefined(this[PENDINGS]) && (this[PENDINGS] = 0);
    this[PENDINGS]++;
  }

  getPendings() {
    return this[PENDINGS] as number;
  }

  setSignals(map: Map<unknown, Callback>) {
    this[SIGNALS] = map;
  }

  getSignals() {
    return this[SIGNALS] as Map<unknown, Callback>;
  }

  resetSignals() {
    this[SIGNALS] = null;
  }
}

class Awaiter {
  store = new Map<Hook, Set<Promise<unknown>>>();

  add(hook: Hook, promise: Promise<unknown>) {
    !this.store.has(hook) && this.store.set(hook, new Set());
    this.store.get(hook).add(promise);
  }

  resolve(cb: (hook: Hook) => void) {
    for (const [hook, promises] of this.store) {
      const $promises = Array.from(promises);

      this.store.delete(hook);

      if ($promises.length > 0) {
        hook.setIsPeinding(true);
        hook.incrementPending();
        const pendings = hook.getPendings();
        cb(hook);

        Promise.allSettled($promises).then(() => {
          if (pendings === hook.getPendings()) {
            hook.setIsPeinding(false);
            cb(hook);
          }
        });
      }
    }
  }
}

function getHook(alt: Fiber, prevInst: Instance, nextInst: Instance): Hook | null {
  if (alt && detectAreSameComponentTypesWithSameKeys(prevInst, nextInst)) return alt.hook;
  if (detectIsComponent(nextInst)) return new Hook();

  return null;
}

type Batcher = {
  timer: TimerId;
  changes: Array<Callback>;
};

type Catcher = (error: Error) => void;

export type NativeElement = unknown;
export type HookValue<T = any> = { deps: Array<any>; value: T };

const SIGNALS = 'signals';
const PENDINGS = 'pendings';
const CATCHER = 'catcher';
const BATCHER = 'batcher';
const PROVIDERS = 'providers';

export { Fiber, Hook, Awaiter, getHook };
