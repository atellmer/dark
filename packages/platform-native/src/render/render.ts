import { Application } from '@nativescript/core';
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
  unmountRoot,
  detectIsFunction,
  setRootId,
  scope$$,
} from '@dark-engine/core';

import { TagNativeElement } from '../native-element';
import { createNativeElement, insertNativeElementByIndex, commit, finishCommit } from '../dom';
import { scheduleCallback, shouldYield } from '../scheduler';
import { type NSElement } from '../registry';

const APP_ID = 0;
let isInjected = false;
let nextRootId = APP_ID;

function inject() {
  platform.createElement = createNativeElement as typeof platform.createElement;
  platform.insertElement = insertNativeElementByIndex as typeof platform.insertElement;
  platform.raf = requestAnimationFrame.bind(this);
  platform.caf = cancelAnimationFrame.bind(this);
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
    setRootId(rootId);
    const scope$ = scope$$();
    const root = scope$.getRoot();
    const isUpdate = Boolean(root);
    const fiber = new Fiber().mutate({
      element: isUpdate ? root.element : new TagNativeElement(ROOT),
      inst: new TagVirtualNode(ROOT, {}, flatten([element || createReplacer()]) as TagVirtualNode['children']),
      alt: root,
      tag: isUpdate ? EffectTag.U : EffectTag.C,
    });
    const emitter = scope$.getEmitter();

    scope$.resetMount();
    scope$.setWorkInProgress(fiber);
    scope$.setNextUnitOfWork(fiber);

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

  platform.schedule(callback, { priority: TaskPriority.NORMAL });

  if (isSubRoot) return null;

  const nativeView = getRootNativeView();

  return nativeView;
}

function getRootNativeView() {
  const fiber = scope$$().getRoot() as Fiber<TagNativeElement>;
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

export { run, renderRoot, renderSubRoot };
