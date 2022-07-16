import { platform } from '../global';
import { getRootId, componentFiberHelper } from '../scope';
import { createUpdateCallback } from '../fiber';
import { useMemo } from '../use-memo';

function useUpdate() {
  const rootId = getRootId();
  const currentFiber = componentFiberHelper.get();
  const scope = useMemo(() => ({ rootId, currentFiber }), []);

  scope.rootId = rootId;
  scope.currentFiber = currentFiber;

  const update = () => {
    const callback = createUpdateCallback({ ...scope });

    platform.scheduleCallback(callback);
  };

  return update;
}

export { useUpdate };
