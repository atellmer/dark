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
} from '@dark-engine/core';
import { createNativeElement, applyCommit, finishCommitWork } from '../dom';
import { detectIsPortal, unmountPortal } from '../portal';
import { scheduleCallback, shouldYeildToHost } from '../scheduler';

platform.scheduleCallback = scheduleCallback;
platform.shouldYeildToHost = shouldYeildToHost;
platform.createNativeElement = createNativeElement as typeof platform.createNativeElement;
platform.applyCommit = applyCommit as typeof platform.applyCommit;
platform.finishCommitWork = finishCommitWork as typeof platform.finishCommitWork;
platform.detectIsPortal = detectIsPortal as typeof platform.detectIsPortal;
platform.unmountPortal = unmountPortal as typeof platform.unmountPortal;

const roots = new Map<Element, number>();

function render(element: DarkElement, container: Element) {
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
  };

  platform.scheduleCallback(callback, { priority: TaskPriority.NORMAL, forceSync: isLayoutEffectsZone.get() });
}

export { render, roots };
