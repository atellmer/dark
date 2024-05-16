import { illegal } from '../utils';
import { type VirtualNode } from '../view';
import { type Callback } from '../shared';
import { type Fiber } from '../fiber';
import { $$scope } from '../scope';

export type Platform = {
  createElement: <N>(vNode: VirtualNode) => N;
  toggle: <N>(element: N, isVisible: boolean) => void;
  raf: typeof requestAnimationFrame;
  caf: typeof cancelAnimationFrame;
  spawn: (callback: Callback) => void;
  commit: (fiber: Fiber) => void;
  finishCommit: () => void;
  detectIsDynamic: () => boolean;
};

const realisation = () => illegal('The function was not installed by renderer!') as any;

const platform: Platform = {
  createElement: realisation,
  toggle: realisation,
  raf: realisation,
  caf: realisation,
  spawn: realisation,
  commit: realisation,
  finishCommit: realisation,
  detectIsDynamic: realisation,
};

const detectIsServer = () => !platform.detectIsDynamic();

const detectIsHydration = () => $$scope().getIsHydrateZone();

const detectIsSSR = () => detectIsServer() || detectIsHydration();

export { platform, detectIsServer, detectIsHydration, detectIsSSR };
