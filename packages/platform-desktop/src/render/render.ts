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
  dummyFn,
  trueFn,
  falseFn,
  scheduler,
} from '@dark-engine/core';

import { TagNativeElement } from '../native-element';
import { createNativeElement, insertNativeElementByIndex, commit, finishCommit } from '../dom';

const raf = setTimeout.bind(this);
const caf = clearTimeout.bind(this);
const spawn = raf;
let isInjected = false;

function inject() {
  platform.createElement = createNativeElement as typeof platform.createElement;
  platform.insertElement = insertNativeElementByIndex as typeof platform.insertElement;
  platform.raf = raf;
  platform.caf = caf;
  platform.spawn = spawn;
  platform.commit = commit;
  platform.finishCommit = finishCommit;
  platform.detectIsDynamic = trueFn;
  platform.detectIsPortal = falseFn;
  platform.unmountPortal = dummyFn;
  platform.chunk = dummyFn;
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

export { render, inject };
