import { detectIsFunction } from '../helpers';
import { wipRootStore, isUpdateHookZone } from '../scope';
import { detectIsTagVirtualNode, detectIsPlainVirtualNode } from '../view';
import type { Context, ContextProviderValue } from '../context';
import type { DarkElementInstance, DarkElementKey } from '../shared';
import { type NativeElement, type Hook, EffectTag } from './types';

class Fiber<N = NativeElement> {
  public id = 0;
  public cc = 0; // child fibers count
  public cec = 0; // child native elements count
  public idx = 0; // idx of fiber in the parent fiber
  public eidx = 0; // native element idx
  public element: N = null; // native element
  public parent: Fiber<N> = null; // parent fiber
  public child: Fiber<N>; // child fiber
  public next: Fiber<N>; // next sibling fiber
  public alt: Fiber<N>; // alternate fiber (previous)
  public copy: Fiber<N>;
  public move: boolean; // flag of reordering in list
  public tag: EffectTag = null; // effect tag (CREATE, UPDATE, DELETE, SKIP)
  public inst: DarkElementInstance = null; // instance of component or virtual node
  public hook: Hook | null; // hook
  public provider: Map<Context, ContextProviderValue>; // provider of context
  public efHost: boolean; // effect host
  public lefHost: boolean; // layout effect host
  public iefHost: boolean; // insertion effect host
  public aHost: boolean; // atom host
  public pHost: boolean; // portal host
  public marker: DarkElementKey; // for dev
  public used: boolean; // flag if fiber already been rendered
  public shadow: boolean; // flag for shadow rendering
  public flush: boolean; // flag for optimizing removing of all elements in parent fiber
  public catch: (error: Error) => void;
  public cleanup: () => void;
  private static nextId = 0;

  constructor(hook: Hook = null, provider: Fiber['provider'] = null, idx = 0) {
    this.id = ++Fiber.nextId;
    this.idx = idx;
    hook && (this.hook = hook);
    provider && (this.provider = provider);
  }

  public mutate(fiber: Partial<Fiber<N>>, excludeMap: Partial<Record<keyof Fiber, boolean>> = {}) {
    const keys = Object.keys(fiber);

    for (const key of keys) {
      if (!excludeMap[key]) {
        this[key] = fiber[key];
      }
    }

    return this;
  }

  public markEFHost() {
    this.efHost = true;
    this.parent && !this.parent.efHost && this.parent.markEFHost();
  }

  public markLEFHost() {
    this.lefHost = true;
    this.parent && !this.parent.lefHost && this.parent.markLEFHost();
  }

  public markIEFHost() {
    this.iefHost = true;
    this.parent && !this.parent.iefHost && this.parent.markIEFHost();
  }

  public markAHost() {
    this.aHost = true;
    this.parent && !this.parent.aHost && this.parent.markAHost();
  }

  public markPHost() {
    this.pHost = true;
    this.parent && !this.parent.pHost && this.parent.markPHost();
  }

  public incCEC(count = 1, force = false) {
    if (!this.parent) return;
    const isUpdate = isUpdateHookZone.get();
    const wipFiber = wipRootStore.get();
    const stop = isUpdate && wipFiber.parent === this.parent;

    if (detectIsPlainVirtualNode(this.inst) || (detectIsTagVirtualNode(this.inst) && this.inst.children.length === 0)) {
      this.cec = 1;
    }

    if (isUpdate && stop && !force) return;

    this.parent.cec += count;

    if (!this.parent.element) {
      this.parent.incCEC(count);
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

export { Fiber };
