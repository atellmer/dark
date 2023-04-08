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
  mountStore,
  TaskPriority,
  createReplacer,
  unmountRoot,
  detectIsFunction,
} from '@dark-engine/core';

import { TagNativeElement } from '../native-element';
import { createNativeElement, commit, finishCommit } from '../dom';
import { scheduleCallback, shouldYield } from '../scheduler';
import { type NSElement } from '../registry';

const APP_ID = 0;
let isInjected = false;

function inject() {
  platform.createElement = createNativeElement as typeof platform.createElement;
  platform.raf = requestAnimationFrame.bind(this);
  platform.caf = cancelAnimationFrame.bind(this);
  platform.schedule = scheduleCallback;
  platform.shouldYield = shouldYield;
  platform.commit = commit;
  platform.finishCommit = finishCommit;
  platform.detectIsDynamic = () => true;
  platform.detectIsPortal = () => false;
  platform.unmountPortal = () => {};
  platform.restart = () => {};
  isInjected = true;
}

type RenderOptions = {
  element: DarkElement;
  rootId?: number;
  isSubRoot?: boolean;
  onCompleted?: (view: NSElement) => void;
};

function render(options: RenderOptions): NSElement {
  const { element, rootId = APP_ID, isSubRoot = false, onCompleted } = options;

  !isInjected && inject();

  const callback = () => {
    rootStore.set(rootId);
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

  platform.schedule(callback, {
    priority: TaskPriority.NORMAL,
    forceSync: true,
    onCompleted: () => {
      if (detectIsFunction(onCompleted)) {
        const nativeView = getRootNativeView();

        if (isSubRoot) {
          unmountRoot(rootId, () => {});
        }

        onCompleted(nativeView);
      }

      rootStore.set(APP_ID);
    },
  });

  if (isSubRoot) return null;

  const nativeView = getRootNativeView();

  return nativeView;
}

function getRootNativeView() {
  const fiber = currentRootStore.get() as Fiber<TagNativeElement>;
  const nativeView = fiber.element.getNativeView();

  return nativeView;
}

let nextRootId = APP_ID;

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

export { run, renderRoot, renderSubRoot };
