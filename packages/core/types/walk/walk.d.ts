import { type Fiber } from '../fiber';
declare type WalkFiberOptions<T> = {
  fiber: Fiber;
  onLoop: (options: OnLoopOptions<T>) => void;
};
declare type OnLoopOptions<T> = {
  nextFiber: Fiber<T>;
  isReturn: boolean;
  resetIsDeepWalking: () => void;
  stop: () => void;
};
declare function walkFiber<T = unknown>(options: WalkFiberOptions<T>): void;
export { walkFiber };
