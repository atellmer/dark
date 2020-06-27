import { Fiber, createFiber, workLoop, updateRoot, EffectTag } from '@core/fiber';
import { DarkElement } from '@core/shared/model';
import { platform } from '@core/global';
import { flatten, isUndefined } from '@helpers';
import { createTagVirtualNode } from '@core/view';
import {
  effectStoreHelper,
  wipRootHelper,
  currentRootHelper,
  nextUnitOfWorkHelper,
  commitPhaseHelper,
} from '@core/scope';
import { createDomLink, mutateDom } from '../dom';


platform.raf = (...args) => requestAnimationFrame(...args);
platform.ric = (...args) => requestIdleCallback(...args);
platform.createLink = ((fiber: Fiber<Element>) => createDomLink(fiber)) as typeof platform.createLink;
platform.mutateTree = ((fiber: Fiber<Element>) => mutateDom(fiber)) as typeof platform.mutateTree;

const roots: Map<Element, number> = new Map();

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

  if (commitPhaseHelper.get()) {
    return updateRoot();
  }

  const fiber = createFiber({
    link: container,
    instance: createTagVirtualNode({
      name: 'root',
      children: flatten([element]),
    }),
    effectTag: isMounted ? EffectTag.UPDATE : EffectTag.PLACEMENT,
    alternate: currentRootHelper.get(),
  });

  wipRootHelper.set(fiber);
  nextUnitOfWorkHelper.set(fiber);
  workLoop({ onRender });
}

export {
  render,
};
