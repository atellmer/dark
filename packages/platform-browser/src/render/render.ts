import {
  type DarkElement,
  ROOT,
  Fiber,
  EffectTag,
  platform,
  flatten,
  detectIsUndefined,
  TagVirtualNode,
  TaskPriority,
  createReplacer,
  setRootId,
  scope$$,
} from '@dark-engine/core';

import type { TagNativeElement } from '../native-element';
import { createNativeElement, insertNativeElementByIndex, commit, finishCommit } from '../dom';
import { detectIsPortal, unmountPortal } from '../portal/utils';
import { scheduleCallback, shouldYield, hasPrimaryTask, cancelTask } from '../scheduler';

let isInjected = false;
const roots = new Map<Element, number>();

function inject() {
  platform.createElement = createNativeElement as typeof platform.createElement;
  platform.insertElement = insertNativeElementByIndex as typeof platform.insertElement;
  platform.raf = requestAnimationFrame.bind(this);
  platform.caf = cancelAnimationFrame.bind(this);
  platform.schedule = scheduleCallback;
  platform.shouldYield = shouldYield;
  platform.hasPrimaryTask = hasPrimaryTask;
  platform.cancelTask = cancelTask;
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
    !hydrate && (container.innerHTML = '');
  } else {
    rootId = roots.get(container);
  }

  const scope$ = scope$$(rootId);

  // insertion effect can't schedule renders
  if (scope$?.getIsInsertionEffectsZone()) return;

  const callback = () => {
    setRootId(rootId); // !
    const scope$ = scope$$();
    const rootFiber = scope$.getRoot();
    const isUpdate = Boolean(rootFiber);
    const fiber = new Fiber().mutate({
      element: container,
      inst: new TagVirtualNode(ROOT, {}, flatten([element || createReplacer()]) as TagVirtualNode['children']),
      alt: rootFiber,
      tag: isUpdate ? EffectTag.U : EffectTag.C,
    });

    scope$.resetMount();
    scope$.setWorkInProgress(fiber);
    scope$.setIsHydrateZone(hydrate);
    scope$.setNextUnitOfWork(fiber);
  };

  platform.schedule(callback, { priority: TaskPriority.NORMAL });
}

export { render, roots };
