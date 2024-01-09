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
  dummyFn,
  scheduler,
} from '@dark-engine/core';

import { createNativeElement, insertNativeElementByIndex, commit, finishCommit } from '../dom';
import { detectIsPortal, unmountPortal } from '../portal';
import type { TagNativeElement } from '../native-element';

const roots = new Map<Element, number>();
const raf = requestAnimationFrame.bind(this);
const caf = cancelAnimationFrame.bind(this);
const spawn = raf;
let isInjected = false;

function inject() {
  platform.createElement = createNativeElement as typeof platform.createElement;
  platform.insertElement = insertNativeElementByIndex as typeof platform.insertElement;
  platform.raf = raf;
  platform.caf = caf;
  platform.spawn = spawn;
  platform.commit = commit;
  platform.finishCommit = finishCommit;
  platform.detectIsDynamic = trueFn;
  platform.detectIsPortal = detectIsPortal;
  platform.unmountPortal = unmountPortal;
  platform.chunk = dummyFn;
  isInjected = true;
}

function render(element: DarkElement, container: TagNativeElement, hydrate?: Callback) {
  !isInjected && inject();
  if (process.env.NODE_ENV !== 'production') {
    if (!(container instanceof Element)) {
      throw new Error(`[Dark]: render receives only Element as container!`);
    }
  }

  const isMounted = !detectIsUndefined(roots.get(container));
  const isHydrate = detectIsFunction(hydrate);
  let rootId: number = null;

  if (!isMounted) {
    rootId = roots.size;
    roots.set(container, rootId);
    !isHydrate && (container.innerHTML = '');
  } else {
    rootId = roots.get(container);
  }

  const $scope = $$scope(rootId);

  // insertion effect can't schedule renders
  if ($scope?.getIsInsertionEffectsZone()) return;

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
    $scope.setWorkInProgress(fiber);
    $scope.setIsHydrateZone(isHydrate);
    $scope.setNextUnitOfWork(fiber);
    isHydrate && hydrate();
  };

  scheduler.schedule(callback, { priority: TaskPriority.NORMAL });
}

export { render, roots, inject };
