import { platform, type ScheduleCallbackOptions } from '../platform';
import { type Fiber } from '../fiber';
import {
  getRootId,
  currentFiberStore,
  batchStore,
  isInsertionEffectsZone,
  isLayoutEffectsZone,
  isBatchZone,
  isTransitionZone,
} from '../scope';
import { createUpdateCallback } from '../workloop';
import { useMemo } from '../use-memo';
import { TaskPriority } from '../constants';
import { trueFn } from '../helpers';

export type UseUpdateOptions = Pick<ScheduleCallbackOptions, 'forceSync'>;

type UseUpdateScope = {
  fiber: Fiber;
};

function useUpdate({ forceSync: forceSync$ }: UseUpdateOptions = {}) {
  const rootId = getRootId();
  const scope = useMemo<UseUpdateScope>(() => ({ fiber: null }), []);

  scope.fiber = currentFiberStore.get();

  const update = (shouldUpdate$?: () => boolean) => {
    if (isInsertionEffectsZone.get()) return;
    const fiber = scope.fiber;
    const isBatch = isBatchZone.get();
    const priority = isTransitionZone.get() ? TaskPriority.LOW : TaskPriority.NORMAL;
    const shouldUpdate = isBatch ? trueFn : shouldUpdate$;
    const forceSync = isLayoutEffectsZone.get() || forceSync$;
    const callback = createUpdateCallback({ rootId, fiber, priority, shouldUpdate });
    const callbackOptions: ScheduleCallbackOptions = { forceSync, priority };

    if (isBatch) {
      shouldUpdate$ && batchStore.add(shouldUpdate$);
      batchStore.setUpdate(() => platform.schedule(callback, callbackOptions));
    } else {
      platform.schedule(callback, callbackOptions);
    }
  };

  return update;
}

export { useUpdate };
