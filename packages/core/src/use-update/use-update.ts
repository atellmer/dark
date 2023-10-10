import { platform, type ScheduleCallbackOptions } from '../platform';
import { type Fiber } from '../fiber';
import { getRootId, scope$$ } from '../scope';
import { createUpdateCallback } from '../workloop';
import { useMemo } from '../use-memo';
import { TaskPriority } from '../constants';
import { trueFn } from '../helpers';

export type UseUpdateOptions = Pick<ScheduleCallbackOptions, 'priority' | 'forceSync'>;

type UseUpdateScope = {
  fiber: Fiber;
};

function useUpdate({ priority: priority$ = TaskPriority.NORMAL, forceSync: forceSync$ }: UseUpdateOptions = {}) {
  const rootId = getRootId();
  const scope = useMemo<UseUpdateScope>(() => ({ fiber: null }), []);
  const fiber = scope$$().getCursorFiber();
  const update = (shouldUpdate$?: () => boolean) => {
    const scope$ = scope$$();
    if (scope$.getIsIEffZone()) return;
    const fiber = scope.fiber;
    const isBatch = scope$.getIsBatchZone();
    const priority = scope$.getIsTransitionZone() ? TaskPriority.LOW : priority$;
    const shouldUpdate = isBatch ? trueFn : shouldUpdate$;
    const forceSync = scope$.getIsLEffZone() || forceSync$;
    const callback = createUpdateCallback({ rootId, fiber, priority, shouldUpdate });
    const callbackOptions: ScheduleCallbackOptions = { forceSync, priority };

    if (isBatch) {
      shouldUpdate$ && scope$.addBatch(shouldUpdate$);
      scope$.setBatchUpdate(() => platform.schedule(callback, callbackOptions));
    } else {
      platform.schedule(callback, callbackOptions);
    }
  };

  scope.fiber = fiber;

  return update;
}

export { useUpdate };
