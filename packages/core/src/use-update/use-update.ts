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

export type UseUpdateOptions = Pick<ScheduleCallbackOptions, 'forceSync'>;
export type UpdateOptions = {
  onStart?: () => void;
};

function useUpdate({ forceSync }: UseUpdateOptions = {}) {
  const rootId = getRootId();
  const scope = useMemo(() => ({ fiber: null }), []);

  scope.fiber = currentFiberStore.get();

  const update = ({ onStart }: UpdateOptions = {}) => {
    if (isInsertionEffectsZone.get()) return;
    const fiber = scope.fiber;
    const priority = isTransitionZone.get() ? TaskPriority.LOW : TaskPriority.NORMAL;
    const callback = createUpdateCallback({ rootId, fiber, priority, onStart });
    const callbackOptions: ScheduleCallbackOptions = {
      forceSync: isLayoutEffectsZone.get() || forceSync,
      priority,
    };

    if (isBatchZone.get()) {
      batch(scope.fiber, () => platform.schedule(callback, callbackOptions));
    } else {
      platform.schedule(callback, callbackOptions);
    }
  };

  return update;
}

export { useUpdate };
