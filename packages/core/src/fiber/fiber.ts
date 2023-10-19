import { detectIsFunction } from '../helpers';
import { scope$$ } from '../scope';
import { detectIsTagVirtualNode, detectIsPlainVirtualNode, detectAreSameComponentTypesWithSameKeys } from '../view';
import { detectIsComponent } from '../component';
import type { Context, ContextProviderValue } from '../context';
import type { DarkElementInstance, Callback } from '../shared';
import { type NativeElement, EffectTag } from './types';

class Fiber<N = NativeElement> {
  public id = 0;
  public cc = 0; // child fibers count
  public cec = 0; // child native elements count
  public idx = 0; // idx of fiber in the parent fiber
  public eidx = 0; // native element idx
  public element: N; // native element
  public parent: Fiber<N> = null; // parent fiber
  public child: Fiber<N>; // child fiber
  public next: Fiber<N>; // next sibling fiber
  public alt: Fiber<N> = null; // alternate fiber (previous)
  public tag: EffectTag = null; // effect tag (CREATE, UPDATE, DELETE, SKIP)
  public inst: DarkElementInstance = null; // instance of component or virtual node
  public hook: Hook | null; // hook
  public provider: Map<Context, ContextProviderValue>; // provider of context
  public move: boolean; // flag of reordering in list
  public aefHost: boolean; // effect host
  public lefHost: boolean; // layout effect host
  public iefHost: boolean; // insertion effect host
  public atomHost: boolean; // atom host
  public portalHost: boolean; // portal host
  public marker: string; // for dev
  public shadow: boolean; // flag for shadow rendering
  public flush: boolean; // flag for optimizing removing of all elements in parent fiber
  public batch: {
    timer: number | NodeJS.Timeout;
    changes: Array<Callback>;
  };
  public catch: (error: Error) => void;
  public cleanup: Callback;
  private static nextId = 0;

  constructor(hook: Hook = null, provider: Fiber['provider'] = null, idx = 0) {
    this.id = ++Fiber.nextId;
    this.idx = idx;
    hook && (this.hook = hook);
    provider && (this.provider = provider);
  }

  public mutate(fiber: Partial<Fiber<N>>) {
    const keys = Object.keys(fiber);

    for (const key of keys) {
      this[key] = fiber[key];
    }

    return this;
  }

  public markAsyncEffectHost() {
    this.aefHost = true;
    this.parent && !this.parent.aefHost && this.parent.markAsyncEffectHost();
  }

  public markLayoutEffectHost() {
    this.lefHost = true;
    this.parent && !this.parent.lefHost && this.parent.markLayoutEffectHost();
  }

  public markInsertionEffectHost() {
    this.iefHost = true;
    this.parent && !this.parent.iefHost && this.parent.markInsertionEffectHost();
  }

  public markAtomHost() {
    this.atomHost = true;
    this.parent && !this.parent.atomHost && this.parent.markAtomHost();
  }

  public markPortalHost() {
    this.portalHost = true;
    this.parent && !this.parent.portalHost && this.parent.markPortalHost();
  }

  public incChildElementCount(count = 1, force = false) {
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
      this.parent.incChildElementCount(count);
    }
  }

  public setError(error: Error) {
    if (detectIsFunction(this.catch)) {
      this.catch(error);
    } else if (this.parent) {
      this.parent.setError(error);
    }
  }

  public static setNextId(id: number) {
    Fiber.nextId = id;
  }
}

class Hook<T = any> {
  idx = 0;
  values: Array<T> = [];
  getSelf: () => Fiber = null;
}

function getHook(alt: Fiber, prevInst: DarkElementInstance, nextInst: DarkElementInstance): Hook | null {
  if (alt && detectAreSameComponentTypesWithSameKeys(prevInst, nextInst)) return alt.hook;
  if (detectIsComponent(nextInst)) return new Hook();

  return null;
}

export { Fiber, Hook, getHook };
