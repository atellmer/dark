import {
  type DarkElement,
  ROOT,
  Fiber,
  EffectTag,
  platform,
  flatten,
  TagVirtualNode,
  TaskPriority,
  createReplacer,
  setRootId,
  scope$$,
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
  platform.hasPrimaryTask = () => false;
  platform.cancelTask = () => {};
  platform.detectIsDynamic = () => true;
  platform.detectIsPortal = () => false;
  platform.unmountPortal = () => {};
  platform.chunk = () => {};
  isInjected = true;
}

function render(element: DarkElement) {
  !isInjected && inject();

  const callback = () => {
    setRootId(0);
    const scope$ = scope$$();
    const root = scope$.getRoot();
    const isUpdate = Boolean(root);
    const fiber = new Fiber().mutate({
      element: isUpdate ? root.element : new TagNativeElement(ROOT),
      inst: new TagVirtualNode(ROOT, {}, flatten([element || createReplacer()]) as TagVirtualNode['children']),
      alt: root,
      tag: isUpdate ? EffectTag.U : EffectTag.C,
    });

    scope$.resetMount();
    scope$.setWorkInProgress(fiber);
    scope$.setNextUnitOfWork(fiber);
  };

  platform.schedule(callback, { priority: TaskPriority.NORMAL });
}

globalThis._DARK_ = Fiber;

export { render };
