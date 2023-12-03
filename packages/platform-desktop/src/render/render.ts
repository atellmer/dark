import {
  type DarkElement,
  ROOT,
  Fiber,
  EFFECT_TAG_CREATE,
  EFFECT_TAG_UPDATE,
  platform,
  flatten,
  TagVirtualNode,
  TaskPriority,
  createReplacer,
  setRootId,
  $$scope,
  scheduler,
} from '@dark-engine/core';

import { TagNativeElement } from '../native-element';
import { createNativeElement, insertNativeElementByIndex, commit, finishCommit } from '../dom';

let isInjected = false;

function inject() {
  platform.createElement = createNativeElement as typeof platform.createElement;
  platform.insertElement = insertNativeElementByIndex as typeof platform.insertElement;
  platform.raf = setTimeout.bind(this);
  platform.caf = clearTimeout.bind(this);
  platform.spawn = setTimeout.bind(this);
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
    setRootId(0);
    const $scope = $$scope();
    const root = $scope.getRoot();
    const isUpdate = Boolean(root);
    const fiber = new Fiber().mutate({
      element: isUpdate ? root.element : new TagNativeElement(ROOT),
      inst: new TagVirtualNode(ROOT, {}, flatten([element || createReplacer()]) as TagVirtualNode['children']),
      alt: root,
      tag: isUpdate ? EFFECT_TAG_UPDATE : EFFECT_TAG_CREATE,
    });

    $scope.resetMount();
    $scope.setWorkInProgress(fiber);
    $scope.setNextUnitOfWork(fiber);
  };

  scheduler.schedule(callback, { priority: TaskPriority.NORMAL });
}

globalThis._DARK_ = Fiber;

export { render };
