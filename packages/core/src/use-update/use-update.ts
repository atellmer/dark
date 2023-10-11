import { type ScheduleCallbackOptions, platform } from '../platform';
import { getRootId, scope$$ } from '../scope';
import { type UpdateChanger, createUpdateCallback } from '../workloop';
import { TaskPriority } from '../constants';
import { getFiberRoute } from '../walk';
import { useMemo } from '../use-memo';
import { detectIsFunction } from '../helpers';

export type UseUpdateOptions = Pick<ScheduleCallbackOptions, 'priority' | 'forceAsync'>;
export type UpdateOptions = UpdateChanger;

function useUpdate({ priority: priority$ = TaskPriority.NORMAL, forceAsync: forceAsync$ }: UseUpdateOptions = {}) {
  const rootId = getRootId();
  const fiber = scope$$().getCursorFiber();
  const scope = useMemo(() => ({ fiber: null, route: [] }), []);
  const update = (createChanger?: () => UpdateChanger) => {
    const scope$ = scope$$();
    if (scope$.getIsInsertionEffectsZone()) return;
    const isBatch = scope$.getIsBatchZone();
    const isTransition = scope$.getIsTransitionZone();
    const priority = isTransition ? TaskPriority.LOW : priority$;
    const forceAsync = isTransition || forceAsync$;
    const callback = createUpdateCallback({
      rootId,
      scope,
      priority,
      isTransition,
      isBatch,
      createChanger,
    });
    const callbackOptions: ScheduleCallbackOptions = { forceAsync, priority };

    if (isBatch) {
      detectIsFunction(createChanger) && scope$.addBatch(() => createChanger().setValue());
      scope$.setBatchUpdate(() => platform.schedule(callback, callbackOptions));
    } else {
      platform.schedule(callback, callbackOptions);
    }
  };

  scope.fiber = fiber;
  scope.route = getFiberRoute(fiber);

  return update;
}

export { useUpdate };
