import { type Fiber } from '../fiber';
import { type TaskPriority } from '../constants';
import { type ComponentFactory } from '../component';
import { type VirtualNode } from '../view';

export type Platform = {
  scheduleCallback: (callback: () => void, options?: ScheduleCallbackOptions) => void;
  shouldYeildToHost: () => boolean;
  createNativeElement: <N>(vNode: VirtualNode) => N;
  applyCommit: <N>(fiber: Fiber<N>) => void;
  finishCommitWork: () => void;
  detectIsPortal: (factory: ComponentFactory) => boolean;
  unmountPortal: <N>(fiber: Fiber<N>) => void;
};

export type ScheduleCallbackOptions = {
  priority?: TaskPriority;
  timeoutMs?: number;
  forceSync?: boolean;
};
