import { Fiber } from '../fiber';


export type Platform = {
  raf: typeof requestAnimationFrame;
  ric: typeof requestIdleCallback;
  createLink: <N>(fiber: Fiber<N>) => N;
  mutateTree: <N>(fiber: Fiber<N>) => void;
};
