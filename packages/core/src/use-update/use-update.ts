import { type ScheduleCallbackOptions, platform } from '../platform';
import { getRootId, scope$$ } from '../scope';
import { type UpdateChanger, createUpdateCallback } from '../workloop';
import { TaskPriority } from '../constants';
import { addBatch } from '../batch';
import { detectIsFunction } from '../helpers';
import { createFiberSign } from '../walk';

export type UseUpdateOptions = Pick<ScheduleCallbackOptions, 'priority' | 'forceAsync'>;
export type UpdateOptions = UpdateChanger;

function useUpdate({ priority: priority$ = TaskPriority.NORMAL, forceAsync: forceAsync$ }: UseUpdateOptions = {}) {
  const rootId = getRootId();
  const fiber = scope$$().getCursorFiber();
  const idx = fiber.hook.idx;
  const update = (createChanger?: () => UpdateChanger) => {
    const scope$ = scope$$();
    if (scope$.getIsInsertionEffectsZone()) return;
    const isTransition = scope$.getIsTransitionZone();
    const isBatch = scope$.getIsBatchZone();
    const priority = isTransition ? TaskPriority.LOW : priority$; // !
    const forceAsync = isTransition || forceAsync$;
    const getFiber = () => fiber.hook.self;
    const callback = createUpdateCallback({ rootId, isTransition, getFiber, createChanger });
    const sign = () => createFiberSign(getFiber(), idx);
    const callbackOptions: ScheduleCallbackOptions = { priority, forceAsync, isTransition, sign };

    if (isBatch) {
      addBatch(
        getFiber(),
        () => platform.schedule(callback, callbackOptions),
        () => detectIsFunction(createChanger) && createChanger().setValue(),
      );
    } else {
      platform.schedule(callback, callbackOptions);
    }
  };

  return update;
}

export { useUpdate };
