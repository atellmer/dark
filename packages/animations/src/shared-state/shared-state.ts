class SharedState {
  private flow = Flow.RIGHT;
  private isTrail = false;
  private isLoop = false;
  private isReverse = false;

  constructor(isTrail = false) {
    this.isTrail = isTrail;
  }

  setFlow(x: Flow) {
    this.flow = x;
  }

  detectIsRightFlow() {
    return this.flow === Flow.RIGHT;
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

  setIsReverse(x: boolean) {
    this.isReverse = x;
  }

  getIsReverse() {
    return this.isReverse;
  }
}

export enum Flow {
  RIGHT = 'RIGHT',
  LEFT = 'LEFT',
}

let sharedState: SharedState = null;

function setSharedState(shared: SharedState) {
  sharedState = shared;
}

function getSharedState() {
  const shared = sharedState;

  sharedState = null;

  return shared;
}

export { SharedState, setSharedState, getSharedState };
