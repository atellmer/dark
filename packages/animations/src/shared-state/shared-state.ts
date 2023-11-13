import { nextTick, detectIsEmpty } from '@dark-engine/core';

import { type Controller, type StartFn } from '../controller';
import { type SpringValue, type Key } from '../shared';

class SharedState<T extends string = string> {
  private ctrls: Array<Controller<T>> = [];
  private stack = new Set<Key>();
  private flow = Flow.RIGHT;
  private isTrail = false;
  private isLoop = false;
  private withReset = false;
  private isPaused = false;
  private delayTimeout = 0;
  private delayId: number | NodeJS.Timeout = null;
  private events = new Map<AnimationEventName, Set<AnimationEventHandler<T>>>();

  setCtrls(ctrls: Array<Controller<T>>) {
    this.ctrls = ctrls;
  }

  addCtrl(ctrl: Controller<T>) {
    this.ctrls.push(ctrl);
  }

  removeCtrl(ctrl: Controller<T>) {
    const idx = this.ctrls.findIndex(x => x === ctrl);

    idx !== -1 && this.ctrls.splice(idx, 1);
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

  wrap(fn: () => void) {
    this.resetScheduledDelay();

    if (this.delayTimeout > 0) {
      this.delayId = setTimeout(fn, this.delayTimeout);
    } else {
      fn();
    }
  }

  start(fn?: StartFn<T>) {
    this.event('setup-start');
    this.wrap(() => {
      const [ctrl] = this.ctrls;
      if (!ctrl) return;
      this.event('series-start');
      this.event('series-start-forward');
      this.setFlow(Flow.RIGHT);

      if (this.isTrail) {
        ctrl.start(fn);
      } else {
        this.ctrls.forEach(x => x.start(fn));
      }
    });
  }

  back() {
    this.event('setup-back');
    this.wrap(() => {
      const [ctrl] = this.ctrls;
      if (!ctrl) return;
      this.event('series-start');
      this.event('series-start-backward');
      this.setFlow(Flow.LEFT);

      if (this.isTrail) {
        const ctrl = this.ctrls[this.ctrls.length - 1];

        ctrl.back();
      } else {
        this.ctrls.forEach(x => x.back());
      }
    });
  }

  toggle(isReversed: boolean) {
    this.event('setup-toggle');
    this.wrap(() => {
      const [ctrl] = this.ctrls;

      if (!ctrl) return;
      this.event('series-start');
      if (this.isTrail) {
        if (isReversed) {
          const ctrl = this.ctrls[this.ctrls.length - 1];

          this.setFlow(Flow.LEFT);
          ctrl.toggle();
        } else {
          const [ctrl] = this.ctrls;

          this.setFlow(Flow.RIGHT);
          ctrl.toggle();
        }
      } else {
        this.setFlow(Flow.RIGHT);
        this.ctrls.forEach(x => x.toggle());
      }
    });
  }

  pause() {
    this.isPaused = true;
  }

  resume() {
    this.isPaused = false;
  }

  loop(isEnabled: boolean, withReset: boolean) {
    this.isLoop = isEnabled;
    this.withReset = withReset;
  }

  delay(timeout: number) {
    this.delayTimeout = timeout;
  }

  reset() {
    this.ctrls.forEach(x => x.reset());
  }

  cancel() {
    this.ctrls.forEach(x => x.cancel());
    this.resume();
    this.resetScheduledDelay();
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

    if (isCompleted) {
      this.event('series-end');
      if (this.ctrls.length === 0) return;
      const [ctrl] = this.ctrls;
      const isReachedTo = ctrl.detectIsReachedTo();
      const isReachedFrom = ctrl.detectIsReachedFrom();

      if (isReachedTo) {
        this.event('series-end-forward');
        if (this.isLoop) {
          if (this.withReset) {
            nextTick(() => {
              this.ctrls.forEach(x => x.reset());
              this.start();
            });
          } else {
            nextTick(() => this.back());
          }
        }
      } else if (isReachedFrom) {
        this.event('series-end-backward');
        if (this.isLoop) {
          nextTick(() => this.start());
        }
      }
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

export type AnimationEventName =
  | 'setup-start'
  | 'setup-back'
  | 'setup-toggle'
  | 'series-start'
  | 'series-start-forward'
  | 'series-start-backward'
  | 'item-start'
  | 'item-change'
  | 'item-end'
  | 'series-end'
  | 'series-end-forward'
  | 'series-end-backward';

export type AnimationEventValue<T extends string = string> = {
  value: SpringValue<T>;
  idx: number;
  key: Key;
};

export type AnimationEventHandler<T extends string = string> = (value?: AnimationEventValue<T>) => void;

export { SharedState, setSharedState, getSharedState };
