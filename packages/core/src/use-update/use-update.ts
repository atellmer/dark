import { platform, type ScheduleCallbackOptions } from '../platform';
import {
  getRootId,
  currentFiberStore,
  isInsertionEffectsZone,
  isLayoutEffectsZone,
  isBatchZone,
  isTransitionZone,
} from '../scope';
import { createUpdateCallback } from '../workloop';
import { useMemo } from '../use-memo';
import { runBatch as batch } from '../batch';
import { TaskPriority } from '../constants';

function useUpdate(options: ScheduleCallbackOptions = createOptions()) {
  const rootId = getRootId();
  const scope = useMemo(() => ({ fiber: null }), []);

  scope.fiber = currentFiberStore.get();

  const update = (onStart?: () => void) => {
    if (isInsertionEffectsZone.get()) return;
    const fiber = scope.fiber;
    const isAnimation = options.priority === TaskPriority.ANIMATION;
    const isTransition = isTransitionZone.get();
    const callback = createUpdateCallback({ rootId, fiber, onStart });

    options.forceSync = isAnimation || isLayoutEffectsZone.get();
    isTransition && (options.priority = TaskPriority.LOW);

    if (isBatchZone.get()) {
      batch(scope.fiber, () => platform.schedule(callback, options));
    } else {
      platform.schedule(callback, options);
    }
  };

  return update;
}

const createOptions = () => ({ priority: TaskPriority.NORMAL });

export { useUpdate };
