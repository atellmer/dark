import { Fiber } from '../fiber';


export type Platform = {
  raf: typeof requestAnimationFrame;
  ric: typeof requestIdleCallback;
  createLink: <N>(fiber: Fiber<N>) => N;
  applyCommits: <N>(fiber: Fiber<N>) => void;
};
