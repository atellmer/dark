import { getRootId, componentFiberHelper } from '@core/scope';
import { createUpdateCallback } from '@core/fiber';
import { platform } from '@core/global';

function useUpdate() {
  const rootId = getRootId();
  const currentFiber = componentFiberHelper.get();
  const update = () => {
    const callback = createUpdateCallback({ rootId, currentFiber });

    platform.scheduleCallback(callback);
  };

  return [update];
}

export { useUpdate };
