import { Application } from '@nativescript/core';

import {
  type DarkElement,
  ROOT,
  Fiber,
  EffectTag,
  platform,
  flatten,
  TagVirtualNode,
  rootStore,
  wipRootStore,
  currentRootStore,
  nextUnitOfWorkStore,
  fiberMountStore,
  TaskPriority,
  createReplacer,
} from '@dark-engine/core';
import { TagNativeElement } from '../native-element';
import { createNativeElement, applyCommit, finishCommitWork } from '../dom';
import { scheduleCallback, shouldYeildToHost } from '../scheduler';

let isInjected = false;
let nextRootId = -1;

function inject() {
  platform.createNativeElement = createNativeElement as typeof platform.createNativeElement;
  platform.requestAnimationFrame = setTimeout.bind(this);
  platform.cancelAnimationFrame = clearTimeout.bind(this);
  platform.scheduleCallback = scheduleCallback;
  platform.shouldYeildToHost = shouldYeildToHost;
  platform.applyCommit = applyCommit;
  platform.finishCommitWork = finishCommitWork;
  platform.detectIsDynamic = () => true;
  platform.detectIsPortal = () => false;
  platform.unmountPortal = () => {};
  platform.restart = () => {};
  isInjected = true;
}

function render(element: DarkElement) {
  !isInjected && inject();
  const rootId = getNextRootId();

  const callback = () => {
    rootStore.set(rootId); // important order!
    const currentRoot = currentRootStore.get();
    const fiber = new Fiber().mutate({
      nativeElement: new TagNativeElement(ROOT),
      instance: new TagVirtualNode(ROOT, {}, flatten([element || createReplacer()]) as TagVirtualNode['children']),
      alternate: currentRoot,
      effectTag: EffectTag.CREATE,
    });

    fiberMountStore.reset();
    wipRootStore.set(fiber);
    nextUnitOfWorkStore.set(fiber);
  };

  platform.scheduleCallback(callback, {
    priority: TaskPriority.NORMAL,
    forceSync: true,
  });

  const fiber = currentRootStore.get() as Fiber<TagNativeElement>;
  const nativeView = fiber.nativeElement.getNativeView();

  return nativeView;
}

const getNextRootId = () => ++nextRootId;

function run(element: DarkElement) {
  Application.run({
    create: () => render(element),
  });
}

export { run };
