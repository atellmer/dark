import {
  type DarkElement,
  type VirtualNodeFactory,
  type ComponentFactory,
  Fiber,
  EffectTag,
  platform,
  flatten,
  detectIsUndefined,
  TagVirtualNode,
  effectStoreHelper,
  wipRootHelper,
  currentRootHelper,
  nextUnitOfWorkHelper,
  deletionsHelper,
  fiberMountHelper,
  ROOT,
} from '@dark-engine/core';
import { createDomElement, mutateDom, resetNodeCache } from '../dom';
import { detectIsPortal, unmountPortal } from '../portal';
import { scheduleCallback, shouldYeildToHost } from '../scheduling';

platform.scheduleCallback = scheduleCallback;
platform.shouldYeildToHost = shouldYeildToHost;
platform.createNativeElement = createDomElement as typeof platform.createNativeElement;
platform.applyCommits = mutateDom as typeof platform.applyCommits;
platform.detectIsPortal = detectIsPortal as typeof platform.detectIsPortal;
platform.unmountPortal = unmountPortal as typeof platform.unmountPortal;

const roots = new Map<Element, number>();

function render(element: DarkElement, container: Element) {
  if (!(container instanceof Element)) {
    throw new Error(`render expects to receive container as Element!`);
  }

  const isMounted = !detectIsUndefined(roots.get(container));
  let rootId = null;

  if (!isMounted) {
    rootId = roots.size;

    roots.set(container, rootId);
    container.innerHTML = '';
  } else {
    rootId = roots.get(container);
  }

  const callback = () => {
    effectStoreHelper.set(rootId); // important order!
    resetNodeCache();

    const currentRootFiber = currentRootHelper.get();
    const fiber = new Fiber({
      nativeElement: container,
      instance: new TagVirtualNode({
        name: ROOT,
        children: flatten([element]) as Array<VirtualNodeFactory | ComponentFactory>,
      }),
      alternate: currentRootFiber,
      effectTag: isMounted ? EffectTag.UPDATE : EffectTag.PLACEMENT,
    });

    currentRootFiber && (currentRootFiber.alternate = null);
    fiberMountHelper.reset();
    wipRootHelper.set(fiber);
    nextUnitOfWorkHelper.set(fiber);
    deletionsHelper.get().forEach(x => (x.effectTag = EffectTag.UPDATE));
    deletionsHelper.set([]);
  };

  platform.scheduleCallback(callback);
}

export { render };
