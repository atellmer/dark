import { Fiber } from '../fiber';
import { ComponentFactory } from '../component';


export type Platform = {
  raf: typeof requestAnimationFrame;
  ric: typeof requestIdleCallback;
  createNativeElement: <N>(fiber: Fiber<N>) => N;
  applyCommits: <N>(fiber: Fiber<N>) => void;
  detectIsPortal: (factory: ComponentFactory) => boolean;
};
