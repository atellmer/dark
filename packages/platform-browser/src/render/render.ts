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
  createReplacer,
  isInsertionEffectsZone,
  isLayoutEffectsZone,
  isHydrateZone,
} from '@dark-engine/core';
import type { TagNativeElement } from '../native-element';
import { createNativeElement, applyCommit, finishCommitWork } from '../dom';
import { detectIsPortal, unmountPortal } from '../portal';
import { scheduleCallback, shouldYeildToHost } from '../scheduler';

let isInjected = false;
const roots = new Map<Element, number>();

function inject() {
  platform.createNativeElement = createNativeElement as typeof platform.createNativeElement;
  platform.requestAnimationFrame = requestAnimationFrame.bind(this);
  platform.cancelAnimationFrame = cancelAnimationFrame.bind(this);
  platform.scheduleCallback = scheduleCallback;
  platform.shouldYeildToHost = shouldYeildToHost;
  platform.applyCommit = applyCommit;
  platform.finishCommitWork = finishCommitWork;
  platform.detectIsDynamic = () => true;
  platform.detectIsPortal = detectIsPortal;
  platform.unmountPortal = unmountPortal;
  isInjected = true;
}

function render(element: DarkElement, container: TagNativeElement, hydrate = false) {
  !isInjected && inject();

  if (!(container instanceof Element)) {
    throw new Error(`[Dark]: render receives only Element as container!`);
  }

  const isMounted = !detectIsUndefined(roots.get(container));
  let rootId: number = null;

  if (!isMounted) {
    rootId = roots.size;

    roots.set(container, rootId);

    if (!hydrate) {
      container.innerHTML = '';
    }
  } else {
    rootId = roots.get(container);
  }

  // insertion effect can't schedule renders
  if (isInsertionEffectsZone.get(rootId)) return;

  const callback = () => {
    rootStore.set(rootId); // important order!
    const currentRoot = currentRootStore.get();
    const fiber = new Fiber().mutate({
      nativeElement: container,
      instance: new TagVirtualNode({
        name: ROOT,
        children: flatten([element || createReplacer()]) as Array<VirtualNodeFactory | ComponentFactory>,
      }),
      alternate: currentRoot,
      effectTag: isMounted ? EffectTag.UPDATE : EffectTag.CREATE,
    });

    fiberMountStore.reset();
    wipRootStore.set(fiber);
    isHydrateZone.set(hydrate);
    nextUnitOfWorkStore.set(fiber);
  };

  platform.scheduleCallback(callback, {
    priority: TaskPriority.NORMAL,
    forceSync: isLayoutEffectsZone.get(),
  });
}

export { render, roots };
