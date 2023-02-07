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
  unmountRoot,
  detectIsFunction,
} from '@dark-engine/core';

import { TagNativeElement } from '../native-element';
import { createNativeElement, applyCommit, finishCommitWork } from '../dom';
import { scheduleCallback, shouldYeildToHost } from '../scheduler';
import { type NSElement } from '../registry';

const APP_ID = 0;
let isInjected = false;

function inject() {
  platform.createNativeElement = createNativeElement as typeof platform.createNativeElement;
  platform.requestAnimationFrame = requestAnimationFrame.bind(this);
  platform.cancelAnimationFrame = cancelAnimationFrame.bind(this);
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

type RenderOptions = {
  element: DarkElement;
  rootId?: number;
  isRoot?: boolean;
  onCompleted?: (view: NSElement) => void;
};

function render(options: RenderOptions): NSElement {
  const { element, rootId = APP_ID, isRoot = true, onCompleted } = options;

  !isInjected && inject();

  const callback = () => {
    rootStore.set(rootId);
    const currentRoot = currentRootStore.get();
    const isUpdate = Boolean(currentRoot);
    const fiber = new Fiber().mutate({
      nativeElement: isUpdate ? currentRoot.nativeElement : new TagNativeElement(ROOT),
      instance: new TagVirtualNode(ROOT, {}, flatten([element || createReplacer()]) as TagVirtualNode['children']),
      alternate: currentRoot,
      effectTag: isUpdate ? EffectTag.UPDATE : EffectTag.CREATE,
    });

    fiberMountStore.reset();
    wipRootStore.set(fiber);
    nextUnitOfWorkStore.set(fiber);
  };

  platform.scheduleCallback(callback, {
    priority: TaskPriority.NORMAL,
    forceSync: true,
    onCompleted: () => {
      if (detectIsFunction(onCompleted)) {
        const nativeView = getRootNativeView();

        if (!isRoot) {
          unmountRoot(rootId, () => {});
        }

        onCompleted(nativeView);
      }

      rootStore.set(APP_ID);
    },
  });

  if (!isRoot) return null;

  const nativeView = getRootNativeView();

  return nativeView;
}

function getRootNativeView() {
  const fiber = currentRootStore.get() as Fiber<TagNativeElement>;
  const nativeView = fiber.nativeElement.getNativeView();

  return nativeView;
}

let nextRootId = 0;

function renderRoot(element: DarkElement) {
  return render({ element });
}

function renderSubRoot(element: DarkElement, onCompleted: RenderOptions['onCompleted']) {
  return render({
    element,
    isRoot: false,
    rootId: ++nextRootId,
    onCompleted,
  });
}

function run(element: DarkElement) {
  Application.run({
    create: () => renderRoot(element),
  });
}

export { run, renderRoot, renderSubRoot };
