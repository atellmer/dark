import { type Fiber } from '../fiber';
import { type TaskPriority } from '../constants';
import { type ComponentFactory } from '../component';

export type Platform = {
  scheduleCallback: (callback: () => void, options?: ScheduleCallbackOptions) => void;
  shouldYeildToHost: () => boolean;
  createNativeElement: <N>(fiber: Fiber<N>) => N;
  applyCommits: <N>(fiber: Fiber<N>) => void;
  detectIsPortal: (factory: ComponentFactory) => boolean;
  unmountPortal: <N>(fiber: Fiber<N>) => void;
};

export type ScheduleCallbackOptions = {
  priority?: TaskPriority;
  timeoutMs?: number;
};
