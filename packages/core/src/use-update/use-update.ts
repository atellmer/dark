import { platform } from '../global';
import { getRootId, componentFiberHelper } from '../scope';
import { createUpdateCallback } from '../fiber';

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
