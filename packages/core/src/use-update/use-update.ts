import { platform } from '../global';
import { getRootId, componentFiberHelper } from '../scope';
import { createUpdateCallback } from '../fiber';
import { useMemo } from '../use-memo';
import { dummyFn } from '../helpers';
import { type TaskPriority } from '../constants';

function useUpdate(priority?: TaskPriority) {
  const rootId = getRootId();
  const fiber = componentFiberHelper.get();
  const scope = useMemo(() => ({ fiber }), []);

  scope.fiber = fiber;

  const update = (onStart?: () => void) => {
    const callback = createUpdateCallback({ rootId, fiber: scope.fiber, onStart: onStart || dummyFn });

    platform.scheduleCallback(callback, priority);
  };

  return update;
}

export { useUpdate };
