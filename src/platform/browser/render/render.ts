import { Fiber, createFiber, workLoop } from '@core/fiber';
import { DarkElement } from '@core/shared/model';
import { global } from '@core/global';
import { flatten, isUndefined } from '@helpers';
import { createTagVirtualNode } from '@core/view';
import {
  effectStoreHelper,
  wipRootHelper,
  currentRootHelper,
  nextUnitOfWorkHelper,
} from '@core/scope';
import { createDomLink, updateDom } from '../dom';


global.raf = (...args) => requestAnimationFrame(...args);
global.ric = (...args) => requestIdleCallback(...args);
global.createLink = ((fiber: Fiber<HTMLElement>) => createDomLink(fiber)) as typeof global.createLink;
global.updateTree = ((fiber: Fiber<HTMLElement>) => updateDom(fiber)) as typeof global.updateTree;

const roots: Map<HTMLElement, number> = new Map();

function render(element: DarkElement, container: HTMLElement) {
  if (!(container instanceof HTMLElement)) {
    throw new Error(`render expects to receive container as HTMLElement!`);
  }

  const isMounted = !isUndefined(roots.get(container));

  if (!isMounted) {
    const rootId = roots.size;

    roots.set(container, rootId);
    effectStoreHelper.set(rootId);
    container.innerHTML = '';
  }

  const fiber = createFiber({
    link: container,
    instance: createTagVirtualNode({
      name: 'root',
      children: flatten([element]),
    }),
    alternate: currentRootHelper.get(),
  });

  wipRootHelper.set(fiber);
  nextUnitOfWorkHelper.set(fiber);

  if (!isMounted) {
    workLoop();
  } else {
    global.ric(workLoop);
  }
}

export {
  render,
};
