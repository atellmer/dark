import { Fiber, workLoop, EffectTag } from '@core/fiber';
import { DarkElement } from '@core/shared/model';
import { platform } from '@core/global';
import { flatten, isUndefined } from '@helpers';
import { TagVirtualNode, VirtualNode } from '@core/view';
import {
  effectStoreHelper,
  wipRootHelper,
  currentRootHelper,
  nextUnitOfWorkHelper,
  getRootId,
  deletionsHelper,
  fiberMountHelper,
} from '@core/scope';
import { createDomElement, mutateDom, resetNodeCache } from '../dom';
import { ComponentFactory } from '@core/component';
import { ROOT } from '@core/constants';
import { scheduler, UpdatorZone } from '@core/scheduler';
import { runMutationObserver } from '../portal';


platform.raf = window.requestAnimationFrame.bind(this);
platform.ric = window.requestIdleCallback.bind(this);
platform.createNativeElement = createDomElement as typeof platform.createNativeElement;
platform.applyCommits = mutateDom as typeof platform.applyCommits;

const roots = new Map<Element, number>();
runMutationObserver();

function render(element: DarkElement, container: Element, onRender?: () => void) {
  if (!(container instanceof Element)) {
    throw new Error(`render expects to receive container as Element!`);
  }

  const isMounted = !isUndefined(roots.get(container));

  if (!isMounted) {
    scheduler.run();
    const rootId = roots.size;

    roots.set(container, rootId);
    effectStoreHelper.set(rootId);
    container.innerHTML = '';
  } else {
    const rootId = roots.get(container);

    effectStoreHelper.set(rootId);
  }

  const rootId = getRootId();

  scheduler.scheduleTask({
    zone: UpdatorZone.ROOT,
    run: (deadline: IdleDeadline) => {
      effectStoreHelper.set(rootId);
      resetNodeCache();

      const currentRootFiber = currentRootHelper.get();
      const fiber = new Fiber({
        nativeElement: container,
        instance: new TagVirtualNode({
          name: ROOT,
          children: flatten([element]) as Array<VirtualNode | ComponentFactory>,
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
      workLoop({ deadline, onRender });
    },
  });
}

export {
  render,
};
