import { detectIsTagVirtualNode, detectIsPlainVirtualNode, detectAreSameComponentTypesWithSameKeys } from '../view';
import { type Instance, type Callback, type TimerId } from '../shared';
import { type Context, type ContextProviderValue } from '../context';
import { detectIsComponent } from '../component';
import { detectIsFunction } from '../helpers';
import { type Atom } from '../atom';
import { scope$$ } from '../scope';
import { type NativeElement, EffectTag, Mask } from './types';

class Fiber<N = NativeElement> {
  id = 0;
  cc = 0; // child fibers count
  cec = 0; // child native elements count
  idx = 0; // idx of fiber in the parent fiber
  eidx = 0; // native element idx
  mask = 0; // bit mask
  element: N = null; // native element
  tag: EffectTag = null; // effect tag (CREATE, UPDATE, DELETE, SKIP)
  parent: Fiber<N> = null; // parent fiber
  child: Fiber<N> = null; // child fiber
  next: Fiber<N> = null; // next sibling fiber
  alt: Fiber<N> = null; // alternate fiber (previous)
  inst: Instance = null; // instance of component or virtual node
  hook: Hook | null = null; // hook
  provider: Map<Context, ContextProviderValue> = null; // provider of context
  atoms: Map<Atom, Callback> = null;
  marker: string; // for dev
  batch: Batch;
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

function getHook(alt: Fiber, prevInst: Instance, nextInst: Instance): Hook | null {
  if (alt && detectAreSameComponentTypesWithSameKeys(prevInst, nextInst)) return alt.hook;
  if (detectIsComponent(nextInst)) return new Hook();

  return null;
}

type Batch = {
  timer: TimerId;
  changes: Array<Callback>;
};

export { Fiber, Hook, getHook };
