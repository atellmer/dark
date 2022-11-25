import { type Fiber } from '../fiber';
declare function unmountFiber(fiber: Fiber): void;
declare function unmountRoot(rootId: number, onComplete: () => void): void;
export { unmountFiber, unmountRoot };
