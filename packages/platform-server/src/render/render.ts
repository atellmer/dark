import {
  type DarkElement,
  type VirtualNodeFactory,
  type ComponentFactory,
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
  createReplacer,
  unmountRoot,
} from '@dark-engine/core';
import { createNativeElement, applyCommit, finishCommitWork } from '../dom';
import { scheduleCallback, shouldYeildToHost } from '../scheduler';
import { TagNativeElement } from '../native-element';

platform.createNativeElement = createNativeElement as typeof platform.createNativeElement;
platform.requestAnimationFrame = setTimeout.bind(this);
platform.cancelAnimationFrame = setTimeout.bind(this);
platform.scheduleCallback = scheduleCallback;
platform.shouldYeildToHost = shouldYeildToHost;
platform.applyCommit = applyCommit;
platform.finishCommitWork = finishCommitWork;
platform.detectIsDynamic = () => false;
platform.detectIsPortal = () => false;
platform.unmountPortal = () => {};

function renderToString(element: DarkElement): string {
  const rootId = getNextRootId();
  const callback = () => {
    rootStore.set(rootId);
    const fiber = new Fiber().mutate({
      nativeElement: new TagNativeElement(ROOT),
      instance: new TagVirtualNode({
        name: ROOT,
        children: flatten([element || createReplacer()]) as Array<VirtualNodeFactory | ComponentFactory>,
      }),
      effectTag: EffectTag.CREATE,
    });

    fiberMountStore.reset();
    wipRootStore.set(fiber);
    nextUnitOfWorkStore.set(fiber);
  };

  platform.scheduleCallback(callback);

  const fiber = currentRootStore.get() as Fiber<TagNativeElement>;
  const content = fiber.nativeElement.toString(true);

  unmountRoot(rootId, () => {});

  return content;
}

let nextRootId = -1;

const getNextRootId = () => ++nextRootId;

export { renderToString };
