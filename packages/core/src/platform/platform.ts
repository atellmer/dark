import { illegalFromPackage } from '../utils';
import { type VirtualNode } from '../view';
import { type Callback } from '../shared';
import { type Fiber } from '../fiber';
import { $$scope } from '../scope';

export type Platform = {
  createElement: <N>(vNode: VirtualNode) => N;
  insertElement: <N>(element: N, idx: number, parentElement: N) => void;
  removeElement: <N>(element: N, parentElement: N) => void;
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

const realisation = () => illegalFromPackage('The function was not installed by renderer!') as any;

const platform: Platform = {
  createElement: realisation,
  insertElement: realisation,
  removeElement: realisation,
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

const detectIsHydration = () => $$scope().getIsHydrateZone();

const detectIsSSR = () => detectIsServer() || detectIsHydration();

export { platform, detectIsServer, detectIsHydration, detectIsSSR };
