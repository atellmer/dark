import { Fiber, EffectTag } from '../fiber';
import { currentFiberStore } from '../scope';
import { detectIsTextVirtualNode, detectIsTagVirtualNode, Text, TagVirtualNode } from '../view';
import { platform } from '../platform';

class Signal<T = unknown> {
  value: T;
  subs: Record<string, Fiber> = {};

  constructor(value: T) {
    this.value = value;
  }

  get() {
    const fiber = currentFiberStore.get();
    const key = createKey(fiber);

    this.subs[key] = fiber;

    return this.value;
  }

  set(fn: (prevValue: T) => T) {
    const keys = Object.keys(this.subs);

    this.value = fn(this.value);

    for (const key of keys) {
      const fiber = this.subs[key];

      fiber.alt = new Fiber().mutate(fiber);
      fiber.tag = EffectTag.U;

      if (detectIsTextVirtualNode(fiber.inst)) {
        fiber.inst = Text(this.value + '');
      } else if (detectIsTagVirtualNode(fiber.inst)) {
        const instance = new TagVirtualNode(fiber.inst.name, { ...fiber.inst.attrs }, []);
        const keys = Object.keys(fiber.inst.attrs);

        fiber.inst = instance;

        for (const key of keys) {
          instance.attrs[key] = this.value;
        }
      }

      platform.commit(fiber);
    }
  }
}

const signal = <T>(value: T) => new Signal(value);

const detectIsSignal = (value: unknown): value is Signal => value instanceof Signal;

function createKey(fiber: Fiber) {
  let nextFiber = fiber;
  let key = '';

  while (nextFiber) {
    key = `${nextFiber.idx}${key ? `:${key}` : ''}`;
    nextFiber = nextFiber.parent;
  }

  return key;
}

export { Signal, signal, detectIsSignal };
