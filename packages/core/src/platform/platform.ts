import { illegal, formatErrorMsg } from '../utils';
import { type VirtualNode } from '../view';
import { type Callback } from '../shared';
import { type Fiber } from '../fiber';
import { LIB } from '../constants';

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

const realisation = () => illegal(formatErrorMsg(LIB, 'The function was not installed by renderer!')) as any;

const platform: Platform = {
  createElement: realisation,
  insertElement: realisation,
  raf: realisation,
  caf: realisation,
  spawn: realisation,
  commit: realisation,
  finishCommit: realisation,
  detectIsDynamic: realisation,
  detectIsPortal: realisation,
  unmountPortal: realisation,
  chunk: realisation,
};

const detectIsServer = () => !platform.detectIsDynamic();

export { platform, detectIsServer };
