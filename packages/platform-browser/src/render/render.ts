import {
  type DarkElement,
  type VirtualNodeFactory,
  type ComponentFactory,
  ROOT,
  Fiber,
  EffectTag,
  platform,
  flatten,
  detectIsUndefined,
  TagVirtualNode,
  rootStore,
  wipRootStore,
  currentRootStore,
  nextUnitOfWorkStore,
  fiberMountStore,
  TaskPriority,
  createEmptyVirtualNode,
  isLayoutEffectsZone,
  trackStore,
} from '@dark-engine/core';
import { createNativeElement, applyCommit, finishCommitWork } from '../dom';
import { detectIsPortal, unmountPortal } from '../portal';
import { scheduleCallback, shouldYeildToHost } from '../scheduler';

platform.createNativeElement = createNativeElement as typeof platform.createNativeElement;
platform.requestAnimationFrame = requestAnimationFrame.bind(this);
platform.scheduleCallback = scheduleCallback;
platform.shouldYeildToHost = shouldYeildToHost;
platform.applyCommit = applyCommit;
platform.finishCommitWork = finishCommitWork;
platform.detectIsPortal = detectIsPortal;
platform.unmountPortal = unmountPortal;

const roots = new Map<Element, number>();

export type RenderOptions = {
  trackUpdate?: (node: Element) => void;
};

function render(element: DarkElement, container: Element, options?: RenderOptions) {
  const { trackUpdate } = options || {};

  if (!(container instanceof Element)) {
    throw new Error(`[Dark]: render receives only Element as container!`);
  }

  const isMounted = !detectIsUndefined(roots.get(container));
  let rootId = null;

  if (!isMounted) {
    rootId = roots.size;

    roots.set(container, rootId);
    container.innerHTML = '';
  } else {
    rootId = roots.get(container);
  }

  const callback = () => {
    rootStore.set(rootId); // important order!
    const currentRoot = currentRootStore.get();
    const fiber = new Fiber({
      nativeElement: container,
      instance: new TagVirtualNode({
        name: ROOT,
        children: flatten([element || createEmptyVirtualNode()]) as Array<VirtualNodeFactory | ComponentFactory>,
      }),
      alternate: currentRoot,
      effectTag: isMounted ? EffectTag.UPDATE : EffectTag.PLACEMENT,
    });

    currentRoot && (currentRoot.alternate = null);
    fiberMountStore.reset();
    wipRootStore.set(fiber);
    nextUnitOfWorkStore.set(fiber);
    trackStore.set(trackUpdate);
  };

  platform.scheduleCallback(callback, { priority: TaskPriority.NORMAL, forceSync: isLayoutEffectsZone.get() });
}

export { render, roots };
