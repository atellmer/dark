import { getRootId, componentFiberHelper } from '@dark/core/scope';
import { createUpdateCallback } from '@dark/core/fiber';
import { platform } from '@dark/core/global';

function useUpdate() {
  const rootId = getRootId();
  const currentFiber = componentFiberHelper.get();
  const update = () => {
    const callback = createUpdateCallback({ rootId, currentFiber });

    platform.scheduleCallback(callback);
  };

  return update;
}

export { useUpdate };
