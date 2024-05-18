import { type Instance, type Callback, type TimerId } from '../shared';
import { type Context, type ContextProviderValue } from '../context';
import { detectAreSameComponentTypesWithSameKeys } from '../view';
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
  element: N = null; // native element
  tag: string = null; // effect tag (CREATE, UPDATE, DELETE, SKIP)
  parent: Fiber<N> = null; // parent fiber
  child: Fiber<N> = null; // child fiber
  next: Fiber<N> = null; // next sibling fiber
  alt: Fiber<N> = null; // alternate fiber (previous)
  inst: Instance = null; // instance of component or virtual node
  hook: Hook | null = null; // hook
  provider: Map<Context, ContextProviderValue> = null; // provider of context
  atoms: Map<Atom, Callback> = null;
  isPortal = false; // portal host
  wip = false; // work in progress fiber
  marker: string = null; // for dev
  batch: Batch = null;
  catch: (error: Error) => void = null;

  constructor(hook: Hook = null, provider: Fiber['provider'] = null, idx = 0) {
    this.id = Fiber.incrementId();
    this.idx = idx;
    hook && (this.hook = hook);
    provider && (this.provider = provider);
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

    if (!this.parent.element && !this.parent.wip) {
      this.parent.increment(count);
    }
  }

  setError(err: Error) {
    if (detectIsFunction(this.catch)) {
      this.catch(err);
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
  id = 0;
  idx = 0;
  values: Array<T> = [];
  owner: Fiber = null;
  isSuspense = false;
  isPending = false;
  isUpdateHost = false;
  pendings = 0;
  private static nextId = 0;

  constructor() {
    this.id = ++Hook.nextId;
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
        hook.isPending = true;
        hook.pendings++;
        const { pendings } = hook;
        cb(hook);

        Promise.allSettled($promises).then(() => {
          if (pendings === hook.pendings) {
            hook.isPending = false;
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

type Batch = {
  timer: TimerId;
  changes: Array<Callback>;
};

export type NativeElement = unknown;
export type HookValue<T = any> = { deps: Array<any>; value: T };

export { Fiber, Hook, Awaiter, getHook };
