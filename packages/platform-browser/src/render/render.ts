import {
  type DarkElement,
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
  mountStore,
  TaskPriority,
  createReplacer,
  isInsertionEffectsZone,
  isLayoutEffectsZone,
  isHydrateZone,
} from '@dark-engine/core';

import type { TagNativeElement } from '../native-element';
import { createNativeElement, commit, finishCommit } from '../dom';
import { detectIsPortal, unmountPortal } from '../portal/utils';
import { scheduleCallback, shouldYield } from '../scheduler';

let isInjected = false;
const roots = new Map<Element, number>();

function inject() {
  platform.createElement = createNativeElement as typeof platform.createElement;
  platform.raf = requestAnimationFrame.bind(this);
  platform.caf = cancelAnimationFrame.bind(this);
  platform.schedule = scheduleCallback;
  platform.shouldYield = shouldYield;
  platform.commit = commit;
  platform.finishCommit = finishCommit;
  platform.detectIsDynamic = () => true;
  platform.detectIsPortal = detectIsPortal;
  platform.unmountPortal = unmountPortal;
  platform.chunk = () => {};
  isInjected = true;
}

function render(element: DarkElement, container: TagNativeElement, hydrate = false) {
  !isInjected && inject();

  if (process.env.NODE_ENV !== 'production') {
    if (!(container instanceof Element)) {
      throw new Error(`[Dark]: render receives only Element as container!`);
    }
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
    const isUpdate = Boolean(currentRoot);
    const fiber = new Fiber().mutate({
      element: container,
      inst: new TagVirtualNode(ROOT, {}, flatten([element || createReplacer()]) as TagVirtualNode['children']),
      alt: currentRoot,
      tag: isUpdate ? EffectTag.U : EffectTag.C,
    });

    mountStore.reset();
    wipRootStore.set(fiber);
    isHydrateZone.set(hydrate);
    nextUnitOfWorkStore.set(fiber);
  };

  platform.schedule(callback, {
    priority: TaskPriority.NORMAL,
    forceSync: hydrate || isLayoutEffectsZone.get(),
  });
}

export { render, roots };
