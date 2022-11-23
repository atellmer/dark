import { platform, type ScheduleCallbackOptions } from '../platform';
import { getRootId, componentFiberHelper, isLayoutEffectsZone } from '../scope';
import { createUpdateCallback } from '../fiber';
import { useMemo } from '../use-memo';
import { dummyFn } from '../helpers';

function useUpdate(options?: ScheduleCallbackOptions) {
  const rootId = getRootId();
  const fiber = componentFiberHelper.get();
  const scope = useMemo(() => ({ fiber }), []);

  scope.fiber = fiber;

  const update = (onStart?: () => void) => {
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

    platform.scheduleCallback(callback, options);
  };

  return update;
}

export { useUpdate };
