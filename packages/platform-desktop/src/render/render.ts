import {
  type DarkElement,
  ROOT,
  Fiber,
  CREATE_EFFECT_TAG,
  UPDATE_EFFECT_TAG,
  platform,
  flatten,
  TagVirtualNode,
  TaskPriority,
  createReplacer,
  setRootId,
  $$scope,
  trueFn,
  scheduler,
} from '@dark-engine/core';

import { TagNativeElement } from '../native-element';
import { createNativeElement, toggle, commit, finishCommit } from '../dom';

const raf = setTimeout.bind(this);
const caf = clearTimeout.bind(this);
const spawn = raf;
let isInjected = false;

function inject() {
  platform.createElement = createNativeElement as typeof platform.createElement;
  platform.toggle = toggle as typeof platform.toggle;
  platform.raf = raf;
  platform.caf = caf;
  platform.spawn = spawn;
  platform.commit = commit;
  platform.finishCommit = finishCommit;
  platform.detectIsDynamic = trueFn;
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
      el: isUpdate ? root.el : new TagNativeElement(ROOT),
      inst: new TagVirtualNode(ROOT, {}, flatten([element || createReplacer()]) as TagVirtualNode['children']),
      alt: root,
      tag: isUpdate ? UPDATE_EFFECT_TAG : CREATE_EFFECT_TAG,
    });

    $scope.resetMount();
    $scope.setWorkInProgress(fiber);
    $scope.setUnitOfWork(fiber);
  };

  scheduler.schedule(callback, { priority: TaskPriority.NORMAL });
}

globalThis._DARK_ = Fiber;

export { render, inject };
