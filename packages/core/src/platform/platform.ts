import { type Fiber } from '../fiber';
import { type VirtualNode } from '../view';
import { type Callback } from '../shared';

export type Platform = {
  createElement: <N>(vNode: VirtualNode) => N;
  insertElement: <N>(node: N, idx: number, parent: N) => void;
  raf: typeof requestAnimationFrame;
  caf: typeof cancelAnimationFrame;
  spawn: (callback: Callback) => void;
  commit: (fiber: Fiber) => void;
  finishCommit: () => void;
  detectIsDynamic: () => boolean;
  detectIsPortal: (instance: unknown) => boolean;
  unmountPortal: (fiber: Fiber) => void;
  chunk: (fiber: Fiber) => void;
};

const defaultRealisation = () => {
  throw new Error('Function not installed by renderer!');
};

const platform: Platform = {
  createElement: defaultRealisation,
  insertElement: defaultRealisation,
  raf: defaultRealisation,
  caf: defaultRealisation,
  spawn: defaultRealisation,
  commit: defaultRealisation,
  finishCommit: defaultRealisation,
  detectIsDynamic: defaultRealisation,
  detectIsPortal: defaultRealisation,
  unmountPortal: defaultRealisation,
  chunk: defaultRealisation,
};

const detectIsServer = () => !platform.detectIsDynamic();

export { platform, detectIsServer };
