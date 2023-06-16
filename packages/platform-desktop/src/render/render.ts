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
  mountStore,
  TaskPriority,
  createReplacer,
} from '@dark-engine/core';

import { TagNativeElement } from '../native-element';
import { createNativeElement, insertNativeElementByIndex, commit, finishCommit } from '../dom';
import { scheduleCallback, shouldYield } from '../scheduler';

let isInjected = false;

function inject() {
  platform.createElement = createNativeElement as typeof platform.createElement;
  platform.insertElement = insertNativeElementByIndex as typeof platform.insertElement;
  platform.raf = setTimeout.bind(this);
  platform.caf = clearTimeout.bind(this);
  platform.schedule = scheduleCallback;
  platform.shouldYield = shouldYield;
  platform.commit = commit;
  platform.finishCommit = finishCommit;
  platform.detectIsDynamic = () => true;
  platform.detectIsPortal = () => false;
  platform.unmountPortal = () => {};
  platform.chunk = () => {};
  isInjected = true;
}

function render(element: DarkElement) {
  !isInjected && inject();

  const callback = () => {
    rootStore.set(0);
    const currentRoot = currentRootStore.get();
    const isUpdate = Boolean(currentRoot);
    const fiber = new Fiber().mutate({
      element: isUpdate ? currentRoot.element : new TagNativeElement(ROOT),
      inst: new TagVirtualNode(ROOT, {}, flatten([element || createReplacer()]) as TagVirtualNode['children']),
      alt: currentRoot,
      tag: isUpdate ? EffectTag.U : EffectTag.C,
    });

    mountStore.reset();
    wipRootStore.set(fiber);
    nextUnitOfWorkStore.set(fiber);
  };

  platform.schedule(callback, { priority: TaskPriority.NORMAL, forceSync: true });
}

globalThis._DARK_ = Fiber;

export { render };
