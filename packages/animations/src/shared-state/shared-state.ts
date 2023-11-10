import { nextTick } from '@dark-engine/core';

import { type Controller, type StartFn } from '../controller';

class SharedState<T extends string = string> {
  private ctrls: Array<Controller<T>> = [];
  private stack = new Set<string>();
  private flow = Flow.RIGHT;
  private isTrail = false;
  private isLoop = false;
  private withReset = false;
  private isPaused = false;

  constructor(isTrail = false) {
    this.isTrail = isTrail;
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

  detectIsRightFlow() {
    return this.flow === Flow.RIGHT;
  }

  setIsPlaying(x: boolean, key: string) {
    if (x) {
      this.stack.add(key);
    } else {
      this.stack.delete(key);
    }
  }

  start(fn?: StartFn<T>) {
    const [ctrl] = this.ctrls;
    if (!ctrl) return;
    this.setFlow(Flow.RIGHT);

    if (this.isTrail) {
      ctrl.start(fn);
    } else {
      this.ctrls.forEach(x => x.start(fn));
    }
  }

  back() {
    const [ctrl] = this.ctrls;
    if (!ctrl) return;
    this.setFlow(Flow.LEFT);

    if (this.isTrail) {
      const ctrl = this.ctrls[this.ctrls.length - 1];

      ctrl.back();
    } else {
      this.ctrls.forEach(x => x.back());
    }
  }

  toggle(isReversed: boolean) {
    const [ctrl] = this.ctrls;

    if (!ctrl) return;
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

  reset() {
    this.ctrls.forEach(x => x.reset());
  }

  cancel() {
    this.ctrls.forEach(x => x.cancel());
  }

  complete() {
    const isCompleted = this.detectIsCompleted();

    if (isCompleted && this.ctrls.length > 0) {
      const [ctrl] = this.ctrls;
      const isReachedTo = ctrl.detectIsReachedTo();
      const isReachedFrom = ctrl.detectIsReachedFrom();

      if (isReachedTo) {
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
        if (this.isLoop) {
          nextTick(() => this.start());
        }
      }
    }
  }

  private setFlow(x: Flow) {
    this.flow = x;
  }

  private detectIsCompleted() {
    return this.stack.size === 0;
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

export { SharedState, setSharedState, getSharedState };
