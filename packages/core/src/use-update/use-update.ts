import { platform, type ScheduleCallbackOptions } from '../platform';
import { getRootId, currentFiberStore, isInsertionEffectsZone, isLayoutEffectsZone, isBatchZone } from '../scope';
import { createUpdateCallback } from '../fiber';
import { useMemo } from '../use-memo';
import { dummyFn } from '../helpers';
import { runBatch as batch } from '../batch';

function useUpdate(options?: ScheduleCallbackOptions) {
  const rootId = getRootId();
  const fiber = currentFiberStore.get();
  const scope = useMemo(() => ({ fiber }), []);

  scope.fiber = fiber;

  const update = (onStart?: () => void) => {
    if (isInsertionEffectsZone.get()) return;
    const callback = createUpdateCallback({
      rootId,
      fiber: scope.fiber,
      forceStart: Boolean(options?.timeoutMs),
      onStart: onStart || dummyFn,
    });

    if (isLayoutEffectsZone.get()) {
      options = {
        ...(options || {}),
        forceSync: true,
      };
    }

    if (isBatchZone.get()) {
      batch(scope.fiber, () => platform.scheduleCallback(callback, options));
    } else {
      platform.scheduleCallback(callback, options);
    }
  };

  return update;
}

export { useUpdate };
