import { type Fiber } from '../fiber';
import { type TaskPriority } from '../constants';
import { type VirtualNode } from '../view';
import { type SetPendingStatus } from '../start-transition';

export type Platform = {
  createElement: <N>(vNode: VirtualNode) => N;
  insertElement: <N>(node: N, idx: number, parent: N) => void;
  raf: typeof requestAnimationFrame;
  caf: typeof cancelAnimationFrame;
  schedule: (callback: () => void, options?: ScheduleCallbackOptions) => void;
  shouldYield: () => boolean;
  hasPrimaryTask: () => boolean;
  cancelTask: (restore: (options: RestoreOptions) => void) => void;
  commit: (fiber: Fiber) => void;
  finishCommit: () => void;
  detectIsDynamic: () => boolean;
  detectIsPortal: (instance: unknown) => boolean;
  unmountPortal: (fiber: Fiber) => void;
  chunk: (fiber: Fiber) => void;
};

export type RestoreOptions = {
  fiber: Fiber;
  setValue?: () => void;
  resetValue?: () => void;
};

export type ScheduleCallbackOptions = {
  priority?: TaskPriority;
  forceAsync?: boolean;
  isTransition?: boolean;
  createLocation?: () => string;
  setPendingStatus?: SetPendingStatus;
  onCompleted?: () => void;
};

const defaultRealisation = () => {
  throw new Error('Function not installed by renderer!');
};

const platform: Platform = {
  createElement: defaultRealisation,
  insertElement: defaultRealisation,
  raf: defaultRealisation,
  caf: defaultRealisation,
  schedule: defaultRealisation,
  shouldYield: defaultRealisation,
  hasPrimaryTask: defaultRealisation,
  cancelTask: defaultRealisation,
  commit: defaultRealisation,
  finishCommit: defaultRealisation,
  detectIsDynamic: defaultRealisation,
  detectIsPortal: defaultRealisation,
  unmountPortal: defaultRealisation,
  chunk: defaultRealisation,
};

const detectIsServer = () => !platform.detectIsDynamic();

export { platform, detectIsServer };
