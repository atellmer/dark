import { detectIsEmpty } from '@dark-engine/core';

import { type Controller, type StartFn } from '../controller';
import { type SpringValue, type Key } from '../shared';

class SharedState<T extends string = string> {
  private ctrls: Array<Controller<T>> = [];
  private stack = new Set<Key>();
  private flow = Flow.RIGHT;
  private isTrail = false;
  private isPaused = false;
  private isCanceled = false;
  private delayTimeout = 0;
  private delayId: number | NodeJS.Timeout = null;
  private events = new Map<AnimationEventName, Set<AnimationEventHandler<T>>>();

  getCtrls() {
    return this.ctrls;
  }

  setCtrls(ctrls: Array<Controller<T>>) {
    this.ctrls = ctrls;
  }

  setIsTrail(x: boolean) {
    this.isTrail = x;
  }

  getIsTrail() {
    return this.isTrail;
  }

  getIsPaused() {
    return this.isPaused;
  }

  getIsCanceled() {
    return this.isCanceled;
  }

  detectIsRightFlow() {
    return this.flow === Flow.RIGHT;
  }

  setIsPlaying(x: boolean, key: Key) {
    if (x) {
      this.stack.add(key);
    } else {
      this.stack.delete(key);
    }
  }

  detectIsPlaying(key?: Key) {
    return detectIsEmpty(key) ? this.stack.size > 0 : this.stack.has(key);
  }

  start(fn?: StartFn<T>) {
    this.wrap(() => {
      if (this.ctrls.length === 0) return;
      this.event('series-start');
      this.setFlow(Flow.RIGHT);

      if (this.isTrail) {
        const [ctrl] = this.ctrls;

        ctrl.start(fn);
      } else {
        this.ctrls.forEach(x => x.start(fn));
      }
    });
  }

  pause() {
    this.isPaused = true;
  }

  resume() {
    this.isPaused = false;
  }

  delay(timeout: number) {
    this.delayTimeout = timeout;
  }

  reset() {
    this.ctrls.forEach(x => x.reset());
  }

  cancel() {
    this.ctrls.forEach(x => x.cancel());
    this.resetScheduledDelay();
    this.isCanceled = true;
  }

  on(event: AnimationEventName, handler: AnimationEventHandler<T>) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }

    const subs = this.events.get(event);

    subs.add(handler);

    return () => subs.delete(handler);
  }

  once(event: AnimationEventName, handler: AnimationEventHandler<T>) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }

    const subs = this.events.get(event);
    const handler$: AnimationEventHandler<T> = (...args) => {
      handler(...args);
      subs.delete(handler$);
    };

    subs.add(handler$);

    return () => subs.delete(handler$);
  }

  event(name: AnimationEventName, value: AnimationEventValue<T> = null) {
    this.events.has(name) && this.events.get(name).forEach(x => x(value));
  }

  completeSeries() {
    const isCompleted = !this.detectIsPlaying();

    isCompleted && this.event('series-end');
  }

  private wrap(fn: () => void) {
    this.resetScheduledDelay();

    if (this.delayTimeout > 0) {
      this.delayId = setTimeout(fn, this.delayTimeout);
    } else {
      fn();
    }
  }

  private setFlow(x: Flow) {
    this.flow = x;
  }

  private resetScheduledDelay() {
    this.delayId && clearTimeout(this.delayId);
    this.delayId = null;
  }
}

export enum Flow {
  RIGHT = 'RIGHT',
  LEFT = 'LEFT',
}

let sharedState: SharedState = null;

function setSharedState(state: SharedState) {
  sharedState = state;
}

function getSharedState() {
  const state = sharedState;

  sharedState = null;

  return state;
}

export type AnimationEventName = 'series-start' | 'item-start' | 'item-change' | 'item-end' | 'series-end';

export type AnimationEventValue<T extends string = string> = {
  value: SpringValue<T>;
  idx: number;
  key: Key;
};

export type AnimationEventHandler<T extends string = string> = (value?: AnimationEventValue<T>) => void;

export { SharedState, setSharedState, getSharedState };
