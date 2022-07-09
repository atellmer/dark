import { Fiber, EffectTag } from '@dark/core/fiber';
import { DarkElement } from '@dark/core/shared/model';
import { platform } from '@dark/core/global';
import { flatten, detectIsUndefined } from '@dark/core/internal/helpers';
import { TagVirtualNode, VirtualNodeFactory } from '@dark/core/view';
import {
  effectStoreHelper,
  wipRootHelper,
  currentRootHelper,
  nextUnitOfWorkHelper,
  getRootId,
  deletionsHelper,
  fiberMountHelper,
} from '@dark/core/scope';
import { createDomElement, mutateDom, resetNodeCache } from '../dom';
import { ComponentFactory } from '@dark/core/component';
import { ROOT } from '@dark/core/constants';
import { detectIsPortal, unmountPortal } from '../portal';
import { scheduleCallback, shouldYeildToHost, TaskPriority } from '../scheduling';

platform.raf = window.requestAnimationFrame.bind(this);
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

  if (!isMounted) {
    const rootId = roots.size;

    roots.set(container, rootId);
    effectStoreHelper.set(rootId);
    container.innerHTML = '';
  } else {
    const rootId = roots.get(container);

    effectStoreHelper.set(rootId);
  }

  const rootId = getRootId();
  const callback = () => {
    effectStoreHelper.set(rootId);
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

  platform.scheduleCallback(callback, TaskPriority.HIGH);
}

export { render };
