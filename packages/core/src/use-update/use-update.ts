import { type ScheduleCallbackOptions, platform } from '../platform';
import { getRootId, scope$$ } from '../scope';
import { type UpdateChanger, createUpdateCallback } from '../workloop';
import { TaskPriority } from '../constants';
import { addBatch } from '../batch';
import { detectIsFunction } from '../helpers';
import { createFiberSign } from '../walk';

export type UpdateOptions = UpdateChanger;

function useUpdate() {
  const rootId = getRootId();
  const fiber = scope$$().getCursorFiber();
  const hook = fiber.hook; // !
  const { idx } = hook;
  const update = (createChanger?: () => UpdateChanger) => {
    const scope$ = scope$$();
    if (scope$.getIsInsertionEffectsZone()) return;
    const hasChanger = detectIsFunction(createChanger);
    const isTransition = scope$.getIsTransitionZone();
    const isBatch = scope$.getIsBatchZone();
    const isEvent = scope$.getIsEventZone();
    const priority = isTransition ? TaskPriority.LOW : isEvent ? TaskPriority.HIGH : TaskPriority.NORMAL; // !
    const forceAsync = isTransition;
    const getFiber = () => hook.getOwner(); // !
    const setPendingStatus = scope$.getPendingStatusSetter();
    const callback = createUpdateCallback({
      rootId,
      isTransition,
      getFiber,
      createChanger: hasChanger ? createChanger : undefined,
    });
    const createSign = () => createFiberSign(getFiber(), idx);
    const callbackOptions: ScheduleCallbackOptions = {
      priority,
      forceAsync,
      isTransition,
      createSign,
      setPendingStatus,
    };

    if (isBatch) {
      addBatch(
        getFiber(),
        () => platform.schedule(callback, callbackOptions),
        () => hasChanger && createChanger().setValue(),
      );
    } else {
      platform.schedule(callback, callbackOptions);
    }
  };

  return update;
}

export { useUpdate };
