import { type Fiber } from '../fiber';
import { type TaskPriority } from '../constants';
import { type VirtualNode } from '../view';

export type Platform = {
  createNativeElement: <N>(vNode: VirtualNode) => N;
  requestAnimationFrame: typeof requestAnimationFrame;
  cancelAnimationFrame: typeof cancelAnimationFrame;
  scheduleCallback: (callback: () => void, options?: ScheduleCallbackOptions) => void;
  shouldYeildToHost: () => boolean;
  applyCommit: (fiber: Fiber) => void;
  finishCommitWork: () => void;
  detectIsDynamic: () => boolean;
  detectIsPortal: (instance: unknown) => boolean;
  unmountPortal: (fiber: Fiber) => void;
  restart: () => void;
};

export type ScheduleCallbackOptions = {
  priority?: TaskPriority;
  timeoutMs?: number;
  forceSync?: boolean;
  onCompleted?: () => void;
};

const platform: Platform = {
  createNativeElement: () => {
    throw new Error(msg('createNativeElement'));
  },
  requestAnimationFrame: () => {
    throw new Error(msg('requestAnimationFrame'));
  },
  cancelAnimationFrame: () => {
    throw new Error(msg('cancelAnimationFrame'));
  },
  scheduleCallback: () => {
    throw new Error(msg('scheduleCallback'));
  },
  shouldYeildToHost: () => {
    throw new Error(msg('shouldYeildToHost'));
  },
  applyCommit: () => {
    throw new Error(msg('applyCommit'));
  },
  finishCommitWork: () => {
    throw new Error(msg('finishCommitWork'));
  },
  detectIsDynamic: () => {
    throw new Error(msg('detectIsDynamic'));
  },
  detectIsPortal: () => {
    throw new Error(msg('detectIsPortal'));
  },
  unmountPortal: () => {
    throw new Error(msg('unmountPortal'));
  },
  restart: () => {
    throw new Error(msg('restart'));
  },
};

const msg = (x: string) => `${x} not installed by renderer`;

const detectIsServer = () => !platform.detectIsDynamic();

export { platform, detectIsServer };
