import { detectIsFunction } from '../helpers';
import { scope$$ } from '../scope';
import { detectIsTagVirtualNode, detectIsPlainVirtualNode, detectAreSameComponentTypesWithSameKeys } from '../view';
import { detectIsComponent } from '../component';
import type { Context, ContextProviderValue } from '../context';
import type { DarkElementInstance, Callback } from '../shared';
import { type Atom } from '../atom';
import { type NativeElement, EffectTag, Mask } from './types';

class Fiber<N = NativeElement> {
  id = 0;
  cc = 0; // child fibers count
  cec = 0; // child native elements count
  idx = 0; // idx of fiber in the parent fiber
  eidx = 0; // native element idx
  element: N; // native element
  parent: Fiber<N> = null; // parent fiber
  child: Fiber<N>; // child fiber
  next: Fiber<N>; // next sibling fiber
  alt: Fiber<N> = null; // alternate fiber (previous)
  tag: EffectTag = null; // effect tag (CREATE, UPDATE, DELETE, SKIP)
  inst: DarkElementInstance = null; // instance of component or virtual node
  hook: Hook | null; // hook
  provider: Map<Context, ContextProviderValue>; // provider of context
  mask = 0; // bit mask
  marker: string; // for dev
  batch: Batch;
  atoms: Map<Atom, Callback>;
  catch: (error: Error) => void;

  constructor(hook: Hook = null, provider: Fiber['provider'] = null, idx = 0) {
    this.id = ++Fiber.nextId;
    this.idx = idx;
    hook && (this.hook = hook);
    provider && (this.provider = provider);
  }

  mutate(fiber: Partial<Fiber<N>>) {
    const keys = Object.keys(fiber);

    for (const key of keys) {
      this[key] = fiber[key];
    }

    return this;
  }

  markHost(mask: Mask) {
    this.mask |= mask;
    this.parent && !(this.parent.mask & mask) && this.parent.markHost(mask);
  }

  increment(count = 1, force = false) {
    if (!this.parent) return;
    const scope$ = scope$$();
    const isUpdateZone = scope$.getIsUpdateZone();
    const wipFiber = scope$.getWorkInProgress();
    const stop = isUpdateZone && wipFiber.parent === this.parent;

    if (
      detectIsPlainVirtualNode(this.inst) ||
      (detectIsTagVirtualNode(this.inst) && this.inst.children?.length === 0)
    ) {
      this.cec = 1;
    }

    if (isUpdateZone && stop && !force) return;

    this.parent.cec += count;

    if (!this.parent.element) {
      this.parent.increment(count);
    }
  }

  setError(error: Error) {
    if (detectIsFunction(this.catch)) {
      this.catch(error);
    } else if (this.parent) {
      this.parent.setError(error);
    }
  }

  static setNextId(id: number) {
    Fiber.nextId = id;
  }

  private static nextId = 0;
}

class Hook<T = any> {
  id = 0;
  idx = 0;
  values: Array<T> = [];
  owner: Fiber = null;
  private static nextId = 0;

  constructor() {
    this.id = ++Hook.nextId;
  }
}

function getHook(alt: Fiber, prevInst: DarkElementInstance, nextInst: DarkElementInstance): Hook | null {
  if (alt && detectAreSameComponentTypesWithSameKeys(prevInst, nextInst)) return alt.hook;
  if (detectIsComponent(nextInst)) return new Hook();

  return null;
}

type Batch = {
  timer: number | NodeJS.Timeout;
  changes: Array<Callback>;
};

export { Fiber, Hook, getHook };
