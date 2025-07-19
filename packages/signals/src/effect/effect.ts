import { Callback, detectIsFunction } from '@dark-engine/core';

import { type SupportContext, getContext, setContext } from '../context';
import { AbstractSignal } from '../abstract-signal';

type CallbackWithPossibleDispose = Callback | (() => Callback);

class Effect implements SupportContext {
  private deps = new Set<AbstractSignal>();

  constructor(callback: CallbackWithPossibleDispose) {
    this.track(callback);
  }

  context(x: AbstractSignal<unknown>) {
    this.deps.add(x);
  }

  track(callback: CallbackWithPossibleDispose) {
    const prevContext = getContext();

    setContext(this.context.bind(this));
    this.exec(callback);
    this.deps.forEach(x => x.__on(() => this.exec(callback)));
    setContext(prevContext);
  }

  exec(callback: CallbackWithPossibleDispose) {
    const dispose = callback();
    detectIsFunction(dispose) && dispose();
  }
}

const effect = (callback: CallbackWithPossibleDispose) => new Effect(callback);

export { effect, type Effect };
