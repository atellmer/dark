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
import { dummyFn } from '../helpers';
import { runBatch as batch } from '../batch';
import { TaskPriority } from '../constants';

function useUpdate(options: ScheduleCallbackOptions = createOptions()) {
  const rootId = getRootId();
  const scope = useMemo(() => ({ fiber: null }), []);

  scope.fiber = currentFiberStore.get();

  const update = (onStart?: () => void) => {
    if (isInsertionEffectsZone.get()) return;
    const callback = createUpdateCallback({
      rootId,
      fiber: scope.fiber,
      onStart: onStart || dummyFn,
    });

    isLayoutEffectsZone.get() && (options.forceSync = true);
    isTransitionZone.get() && (options.priority = TaskPriority.LOW);

    if (isBatchZone.get()) {
      batch(scope.fiber, () => platform.schedule(callback, options));
    } else {
      platform.schedule(callback, options);
    }

    isTransitionZone.set(false);
  };

  return update;
}

const createOptions = () => ({ priority: TaskPriority.NORMAL });

export { useUpdate };
