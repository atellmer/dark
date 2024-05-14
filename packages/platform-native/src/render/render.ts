import { Application } from '@nativescript/core';
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
  unmountRoot,
  detectIsFunction,
  setRootId,
  $$scope,
  trueFn,
  scheduler,
} from '@dark-engine/core';

import { TagNativeElement } from '../native-element';
import { createNativeElement, toggle, commit, finishCommit } from '../dom';
import { type NSElement } from '../registry';

const APP_ID = 0;
const raf = requestAnimationFrame.bind(this);
const caf = cancelAnimationFrame.bind(this);
const spawn = raf;
let nextRootId = APP_ID;
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

type RenderOptions = {
  element: DarkElement;
  rootId?: number;
  isSubRoot?: boolean;
  onCompleted?: (view: NSElement) => void;
};

function render(options: RenderOptions): NSElement {
  !isInjected && inject();
  const { element, rootId = APP_ID, isSubRoot = false, onCompleted } = options;
  const callback = () => {
    setRootId(rootId);
    const $scope = $$scope();
    const root = $scope.getRoot();
    const isUpdate = Boolean(root);
    const fiber = new Fiber().mutate({
      element: isUpdate ? root.element : new TagNativeElement(ROOT),
      inst: new TagVirtualNode(ROOT, {}, flatten([element || createReplacer()]) as TagVirtualNode['children']),
      alt: root,
      tag: isUpdate ? UPDATE_EFFECT_TAG : CREATE_EFFECT_TAG,
    });
    const emitter = $scope.getEmitter();

    $scope.resetMount();
    $scope.setWorkInProgress(fiber);
    $scope.setNextUnitOfWork(fiber);

    emitter.on('finish', () => {
      emitter.kill();

      if (detectIsFunction(onCompleted)) {
        const nativeView = getRootNativeView();

        isSubRoot && unmountRoot(rootId, () => {});
        onCompleted(nativeView);
      }

      setRootId(APP_ID);
    });
  };

  scheduler.schedule(callback, { priority: TaskPriority.NORMAL });

  if (isSubRoot) return null;

  const nativeView = getRootNativeView();

  return nativeView;
}

function getRootNativeView() {
  const fiber = $$scope().getRoot() as Fiber<TagNativeElement>;
  const nativeView = fiber.element.getNativeView();

  return nativeView;
}

function renderRoot(element: DarkElement) {
  return render({ element });
}

function renderSubRoot(element: DarkElement, onCompleted: RenderOptions['onCompleted']) {
  return render({
    element,
    isSubRoot: true,
    rootId: ++nextRootId,
    onCompleted,
  });
}

function run(element: DarkElement) {
  Application.run({
    create: () => renderRoot(element),
  });
}

export { run, renderRoot, renderSubRoot, inject };
