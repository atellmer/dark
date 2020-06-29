import { createFiber, workLoop, EffectTag } from '@core/fiber';
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
} from '@core/scope';
import { createDomLink, mutateDom } from '../dom';
import { ComponentFactory } from '@core/component';


platform.raf = requestAnimationFrame.bind(this);
platform.ric = requestIdleCallback.bind(this);
platform.createLink = createDomLink as typeof platform.createLink;
platform.mutateTree = mutateDom as typeof platform.mutateTree;

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

  const currentRootFiber = currentRootHelper.get();
  const fiber = createFiber({
    link: container,
    instance: createTagVirtualNode({
      name: 'root',
      children: flatten([element]) as Array<VirtualNode | ComponentFactory>,
    }),
    alternate: currentRootFiber,
    effectTag: isMounted ? EffectTag.UPDATE : EffectTag.PLACEMENT,
  });

  renderRequests.push((rootId => (deadline: IdleDeadline) => {
    effectStoreHelper.set(rootId);
    currentRootFiber && (currentRootFiber.alternate = null);
    wipRootHelper.set(fiber);
    nextUnitOfWorkHelper.set(fiber);
    workLoop({ deadline, onRender });
  })(getRootId()));

  setTimeout(() => {
    platform.ric(scheduleRenders);
  });
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
