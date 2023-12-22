import { type ScheduleCallbackOptions, scheduler } from '../scheduler';
import { type UpdateChanger, createUpdate } from '../workloop';
import { getRootId, $$scope } from '../scope';
import { TaskPriority } from '../constants';
import { addBatch } from '../batch';
import { detectIsFunction } from '../utils';
import { createHookLocation } from '../walk';

export type UpdateOptions = UpdateChanger;

function useUpdate() {
  const rootId = getRootId();
  const fiber = $$scope().getCursorFiber();
  const hook = fiber.hook; // !
  const { idx } = hook;
  const update = (createChanger?: () => UpdateChanger) => {
    const $scope = $$scope();
    if ($scope.getIsInsertionEffectsZone()) return;
    const { owner } = hook;
    const hasChanger = detectIsFunction(createChanger);
    const isTransition = $scope.getIsTransitionZone();
    const isBatch = $scope.getIsBatchZone();
    const isEvent = $scope.getIsEventZone();
    const priority = isTransition ? TaskPriority.LOW : isEvent ? TaskPriority.HIGH : TaskPriority.NORMAL; // !
    const forceAsync = isTransition;
    const setPendingStatus = $scope.getPendingStatusSetter();
    const callback = createUpdate({
      rootId,
      hook,
      isTransition,
      createChanger: hasChanger ? createChanger : undefined,
    });
    const createLocation = () => createHookLocation(rootId, idx, owner);
    const callbackOptions: ScheduleCallbackOptions = {
      priority,
      forceAsync,
      isTransition,
      createLocation,
      setPendingStatus,
    };

    if (isBatch) {
      addBatch(
        owner,
        () => scheduler.schedule(callback, callbackOptions),
        () => hasChanger && createChanger().setValue(),
      );
    } else {
      scheduler.schedule(callback, callbackOptions);
    }
  };

  return update;
}

export { useUpdate };
