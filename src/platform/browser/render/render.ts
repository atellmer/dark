import { Fiber, workLoop, EffectTag } from '@core/fiber';
import { DarkElement } from '@core/shared/model';
import { platform } from '@core/global';
import { flatten, isUndefined } from '@helpers';
import { createTagVirtualNode, VirtualNode } from '@core/view';
import {
  effectStoreHelper,
  wipRootHelper,
  currentRootHelper,
  nextUnitOfWorkHelper,
  getRootId,
  deletionsHelper,
} from '@core/scope';
import { createDomLink, mutateDom } from '../dom';
import { ComponentFactory } from '@core/component';
import { ROOT } from '@core/constants';


platform.raf = window.requestAnimationFrame.bind(this);
platform.ric = window.requestIdleCallback.bind(this);
platform.createLink = createDomLink as typeof platform.createLink;
platform.applyCommits = mutateDom as typeof platform.applyCommits;

const roots: Map<Element, number> = new Map();
const renderRequests: Array<(deadline: IdleDeadline) => void> = [];

function render(element: DarkElement, container: Element, onRender?: () => void) {
  if (!(container instanceof Element)) {
    throw new Error(`render expects to receive container as HTMLElement!`);
  }

  const isMounted = !isUndefined(roots.get(container));

  if (!isMounted) {
    const rootId = roots.size;

    roots.set(container, rootId);
    effectStoreHelper.set(rootId);
    container.innerHTML = '';
  } else {
    const rootId = roots.get(container);

    effectStoreHelper.set(rootId);
  }

  renderRequests.push((rootId => (deadline: IdleDeadline) => {
    effectStoreHelper.set(rootId);

    const currentRootFiber = currentRootHelper.get();
    const fiber = new Fiber({
      link: container,
      instance: createTagVirtualNode({
        name: ROOT,
        children: flatten([element]) as Array<VirtualNode | ComponentFactory>,
      }),
      alternate: currentRootFiber,
      effectTag: isMounted ? EffectTag.UPDATE : EffectTag.PLACEMENT,
    });

    currentRootFiber && (currentRootFiber.alternate = null);
    wipRootHelper.set(fiber);
    nextUnitOfWorkHelper.set(fiber);
    deletionsHelper.get().forEach(x => (x.effectTag = EffectTag.UPDATE));
    deletionsHelper.set([]);
    workLoop({ deadline, fromRoot: true, onRender });
  })(getRootId()));

  platform.ric(scheduleRenders);
}

function scheduleRenders(deadline: IdleDeadline) {
  const [request] = renderRequests;

  if (request) {
    request(deadline);
    renderRequests.shift();
    platform.ric(scheduleRenders);
  }
}

export {
  render,
};
