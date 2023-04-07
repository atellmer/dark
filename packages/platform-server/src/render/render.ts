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
  createReplacer,
  unmountRoot,
} from '@dark-engine/core';

import { createNativeElement, applyCommit, finishCommitWork } from '../dom';
import { scheduleCallback, shouldYeildToHost } from '../scheduler';
import { TagNativeElement } from '../native-element';

let isInjected = false;
let nextRootId = -1;

function inject() {
  platform.createElement = createNativeElement as typeof platform.createElement;
  platform.raf = setTimeout.bind(this);
  platform.caf = setTimeout.bind(this);
  platform.schedule = scheduleCallback;
  platform.shouldYeild = shouldYeildToHost;
  platform.commit = applyCommit;
  platform.finishCommit = finishCommitWork;
  platform.detectIsDynamic = () => false;
  platform.detectIsPortal = () => false;
  platform.unmountPortal = () => {};
  platform.restart = () => {};
  isInjected = true;
}

function createRenderCallback(element: DarkElement) {
  !isInjected && inject();

  const rootId = getNextRootId();
  const callback = () => {
    rootStore.set(rootId);
    const fiber = new Fiber().mutate({
      element: new TagNativeElement(ROOT),
      inst: new TagVirtualNode(ROOT, {}, flatten([element || createReplacer()]) as TagVirtualNode['children']),
      tag: EffectTag.C,
    });

    mountStore.reset();
    wipRootStore.set(fiber);
    nextUnitOfWorkStore.set(fiber);
  };

  return { rootId, callback };
}

function renderToString(element: DarkElement): string {
  const { rootId, callback } = createRenderCallback(element);
  platform.schedule(callback, { forceSync: true });
  const { element: nativeElement } = currentRootStore.get() as Fiber<TagNativeElement>;
  const content = nativeElement.renderToString(true);

  unmountRoot(rootId, () => {});

  return content;
}

function renderToStringAsync(element: DarkElement): Promise<string> {
  return new Promise<string>(resolve => {
    const { rootId, callback } = createRenderCallback(element);
    const onCompleted = () => {
      const { element: nativeElement } = currentRootStore.get() as Fiber<TagNativeElement>;
      const content = nativeElement.renderToString(true);

      resolve(content);
      unmountRoot(rootId, () => {});
    };

    platform.schedule(callback, { forceSync: false, onCompleted });
  });
}

const getNextRootId = () => ++nextRootId;

export { renderToString, renderToStringAsync };
