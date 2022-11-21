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
  effectStoreHelper,
  wipRootHelper,
  currentRootHelper,
  nextUnitOfWorkHelper,
  fiberMountHelper,
  TaskPriority,
  createEmptyVirtualNode,
} from '@dark-engine/core';
import { createDomElement, applyCommit, finishCommitWork, resetNodeCache } from '../dom';
import { detectIsPortal, unmountPortal } from '../portal';
import { scheduleCallback, shouldYeildToHost } from '../scheduling';

platform.scheduleCallback = scheduleCallback;
platform.shouldYeildToHost = shouldYeildToHost;
platform.createNativeElement = createDomElement as typeof platform.createNativeElement;
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
    effectStoreHelper.set(rootId); // important order!
    resetNodeCache();

    const currentRootFiber = currentRootHelper.get();
    const fiber = new Fiber({
      nativeElement: container,
      instance: new TagVirtualNode({
        name: ROOT,
        children: flatten([element || createEmptyVirtualNode()]) as Array<VirtualNodeFactory | ComponentFactory>,
      }),
      alternate: currentRootFiber,
      effectTag: isMounted ? EffectTag.UPDATE : EffectTag.PLACEMENT,
    });

    currentRootFiber && (currentRootFiber.alternate = null);
    fiberMountHelper.reset();
    wipRootHelper.set(fiber);
    nextUnitOfWorkHelper.set(fiber);
  };

  platform.scheduleCallback(callback, { priority: TaskPriority.NORMAL });
}

export { render, roots };
