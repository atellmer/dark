import { Fiber } from '../fiber';
import { ComponentFactory } from '../component';


export type Platform = {
  raf: typeof requestAnimationFrame;
  scheduleCallback: (callback: () => void, priority?: string) => void;
  shouldYeildToHost: () => boolean;
  createNativeElement: <N>(fiber: Fiber<N>) => N;
  applyCommits: <N>(fiber: Fiber<N>) => void;
  detectIsPortal: (factory: ComponentFactory) => boolean;
  unmountPortal: <N>(fiber: Fiber<N>) => void;
};
