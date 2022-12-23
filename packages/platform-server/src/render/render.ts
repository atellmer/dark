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
      nativeElement: null, // TODO
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

  const currentRoot = currentRootStore.get();
  const nativeElement = currentRoot.nativeElement as Element;
  const content = nativeElement.innerHTML;

  return content;
}

export { renderToString };
