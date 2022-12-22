import { type Fiber } from '../fiber';
type OnLoopOptions<T> = {
  nextFiber: Fiber<T>;
  isReturn: boolean;
  resetIsDeepWalking: () => void;
  stop: () => void;
};
declare function walkFiber<T = unknown>(fiber: Fiber<T>, onLoop: (options: OnLoopOptions<T>) => void): void;
export { walkFiber };
