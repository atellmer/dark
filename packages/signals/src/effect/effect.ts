import { Callback, CallbackWithValue, detectIsFunction, throwThis } from '@dark-engine/core';

import { type SupportContext, getContext, setContext } from '../context';
import { AbstractSignal } from '../abstract-signal';

type EffectCallback = (fn: CallbackWithValue<Callback>) => void | Promise<void>;

class Effect implements SupportContext {
  private deps = new Set<AbstractSignal>();
  private untrackers: Array<Callback> = [];
  private cleanup: Callback = null;

  constructor(callback: EffectCallback) {
    this.track(callback, true);
  }

  __add(x: AbstractSignal<unknown>) {
    this.deps.add(x);
  }

  dispose() {
    this.deps.clear();

    if (this.untrackers) {
      this.untrackers.forEach(x => x());
      this.untrackers = [];
    }

    if (detectIsFunction(this.cleanup)) {
      this.cleanup();
      this.cleanup = null;
    }
  }

  private track(callback: EffectCallback, fromInit = false) {
    const prevContext = getContext();

    setContext(this);

    try {
      !fromInit && this.dispose();
      this.exec(callback);
    } catch (error) {
      throwThis(error);
    } finally {
      for (const dep of this.deps) {
        this.untrackers.push(dep.__on(() => this.track(callback)));
      }

      setContext(prevContext);
    }
  }

  private exec(callback: EffectCallback) {
    callback(cleanup => {
      this.cleanup = cleanup || null;
    });
  }
}

const effect = (callback: EffectCallback) => {
  const instance = new Effect(callback);

  return () => instance.dispose();
};

export { Effect, effect };
