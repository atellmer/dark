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
  const rootId = 0;
  const callback = () => {
    rootStore.set(rootId);
    const currentRoot = currentRootStore.get();
    const fiber = new Fiber().mutate({
      nativeElement: new TagNativeElement(ROOT),
      instance: new TagVirtualNode({
        name: ROOT,
        children: flatten([element || createReplacer()]) as Array<VirtualNodeFactory | ComponentFactory>,
      }),
      alternate: currentRoot,
      effectTag: EffectTag.CREATE,
    });

    currentRoot && (currentRoot.alternate = null);
    fiberMountStore.reset();
    wipRootStore.set(fiber);
    nextUnitOfWorkStore.set(fiber);
  };

  platform.scheduleCallback(callback);

  const nativeElement = currentRootStore.get().nativeElement as TagNativeElement;
  const content = nativeElement.toString(true);

  return content;
}

export { renderToString };
