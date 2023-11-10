import { type Controller } from '../controller';

class SharedState<T extends string = string> {
  private ctrls: Array<Controller<T>> = [];
  private stack = new Set();
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

  getCtrls() {
    return this.ctrls;
  }

  setFlow(x: Flow) {
    this.flow = x;
  }

  detectIsRightFlow() {
    return this.flow === Flow.RIGHT;
  }

  getIsSeriesCompleted() {
    return this.stack.size === 0;
  }

  setIsPlaying(x: boolean, key: string) {
    if (x) {
      this.stack.add(key);
    } else {
      this.stack.delete(key);
    }
  }

  setIsTrail(x: boolean) {
    this.isTrail = x;
  }

  getIsTrail() {
    return this.isTrail;
  }

  setIsLoop(x: boolean) {
    this.isLoop = x;
  }

  getIsLoop() {
    return this.isLoop;
  }

  setWithReset(x: boolean) {
    this.withReset = x;
  }

  getWithReset() {
    return this.withReset;
  }

  pause() {
    this.isPaused = true;
  }

  resume() {
    this.isPaused = false;
  }

  getIsPaused() {
    return this.isPaused;
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
