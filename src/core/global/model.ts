import { Fiber } from '../fiber';


export type Global = {
  raf: typeof requestAnimationFrame;
  ric: typeof requestIdleCallback;
  createLink: <N>(fiber: Fiber<N>) => N;
  updateTree: <N>(fiber: Fiber<N>) => void;
};
