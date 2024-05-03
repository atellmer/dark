import { type ScheduleCallbackOptions, scheduler } from '../scheduler';
import { type Tools, createCallback } from '../workloop';
import { getRootId, $$scope } from '../scope';
import { createHookLocation } from '../walk';
import { detectIsFunction } from '../utils';
import { TaskPriority } from '../constants';
import { addBatch } from '../batch';
import { type Hook } from '../fiber';

function createUpdate(rootId: number, hook: Hook) {
  const { idx } = hook;
  const update = (tools?: () => Tools) => {
    const $scope = $$scope();
    if ($scope.getIsInsertionEffectsZone()) return;
    const { owner } = hook;
    const hasTools = detectIsFunction(tools);
    const isTransition = $scope.getIsTransitionZone();
    const isBatch = $scope.getIsBatchZone();
    const isEvent = $scope.getIsEventZone();
    const priority = isTransition ? TaskPriority.LOW : isEvent ? TaskPriority.HIGH : TaskPriority.NORMAL; // !
    const forceAsync = isTransition;
    const onTransitionStart = $scope.getOnTransitionStart();
    const onTransitionEnd = $scope.getOnTransitionEnd();
    const callback = createCallback({
      rootId,
      hook,
      isTransition,
      tools: hasTools ? tools : undefined,
    });
    const createLocation = () => createHookLocation(rootId, idx, owner);
    const callbackOptions: ScheduleCallbackOptions = {
      priority,
      forceAsync,
      isTransition,
      createLocation,
      onTransitionStart,
      onTransitionEnd,
    };

    if (isBatch) {
      addBatch(
        owner,
        () => scheduler.schedule(callback, callbackOptions),
        () => hasTools && tools().setValue(),
      );
    } else {
      scheduler.schedule(callback, callbackOptions);
    }
  };

  return update;
}

function useUpdate() {
  const rootId = getRootId();
  const fiber = $$scope().getCursorFiber();

  return createUpdate(rootId, fiber.hook);
}

export { createUpdate, useUpdate };
