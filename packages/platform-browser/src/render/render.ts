import {
  type DarkElement,
  type Callback,
  ROOT,
  Fiber,
  CREATE_EFFECT_TAG,
  UPDATE_EFFECT_TAG,
  platform,
  flatten,
  detectIsUndefined,
  detectIsFunction,
  trueFn,
  TagVirtualNode,
  TaskPriority,
  createReplacer,
  setRootId,
  $$scope,
  scheduler,
} from '@dark-engine/core';

import { createNativeElement, toggle, commit, finishCommit } from '../dom';
import { detectIsBrowser, illegal, removeContent } from '../utils';
import { type TagNativeElement } from '../native-element';

const isBrowser = detectIsBrowser();
const roots = new Map<Element, number>();
const raf = isBrowser && requestAnimationFrame.bind(this);
const caf = isBrowser && cancelAnimationFrame.bind(this);
const spawn = raf;
let isInjected = false;

function inject() {
  platform.createElement = createNativeElement as typeof platform.createElement;
  platform.toggle = toggle as typeof platform.toggle;
  platform.raf = raf;
  platform.caf = caf;
  platform.spawn = spawn;
  platform.commit = commit;
  platform.finishCommit = finishCommit;
  platform.detectIsDynamic = trueFn;
  isInjected = true;
}

function render(element: DarkElement, container: TagNativeElement, hydrate?: Callback) {
  !isInjected && inject();
  if (process.env.NODE_ENV !== 'production') {
    if (!(container instanceof Element) && !((container as unknown) instanceof Document)) {
      illegal(`The render receives a valid element as container!`);
    }
  }

  const isMounted = !detectIsUndefined(roots.get(container));
  const isHydration = detectIsFunction(hydrate);
  let rootId: number = null;

  if (!isMounted) {
    rootId = roots.size;
    roots.set(container, rootId);
    !isHydration && removeContent(container);
  } else {
    rootId = roots.get(container);
  }

  const $scope = $$scope(rootId);

  // insertion effect can't schedule renders
  if ($scope?.getIsEffect3()) return;

  const callback = () => {
    setRootId(rootId); // !
    const $scope = $$scope();
    const rootFiber = $scope.getRoot();
    const isUpdate = Boolean(rootFiber);
    const fiber = new Fiber().mutate({
      element: container,
      inst: new TagVirtualNode(ROOT, {}, flatten([element || createReplacer()]) as TagVirtualNode['children']),
      alt: rootFiber,
      tag: isUpdate ? UPDATE_EFFECT_TAG : CREATE_EFFECT_TAG,
    });

    $scope.resetMount();
    $scope.setWip(fiber);
    $scope.setIsHydration(isHydration);
    $scope.setNextUnit(fiber);
    isHydration && hydrate();
  };

  scheduler.schedule(callback, { priority: TaskPriority.NORMAL });
}

export { render, roots, inject };
