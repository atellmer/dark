import { createFiber, workLoop } from '@core/fiber';
import { DarkElement } from '@core/shared/model';
import { global } from '@core/global';
import { flatten } from '@helpers';
import { createTagVirtualNode } from '@core/view';
import {
  wipRootHelper,
  currentRootHelper,
  nextUnitOfWorkHelper,
} from '@core/scope';


global.raf = (...args) => requestAnimationFrame(...args);
global.ric = (...args) => requestIdleCallback(...args);

function render(element: DarkElement, container: HTMLElement) {
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
}

global.ric(workLoop);

export {
  render,
};
