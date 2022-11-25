import { type Fiber } from '../fiber';
declare function batch(callback: () => void): void;
declare function runBatch(fiber: Fiber, callback: () => void): void;
export { batch, runBatch };
