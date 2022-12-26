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
  detectIsPortal: (factory: unknown) => boolean;
  unmountPortal: (fiber: Fiber) => void;
};

export type ScheduleCallbackOptions = {
  priority?: TaskPriority;
  timeoutMs?: number;
  forceSync?: boolean;
};