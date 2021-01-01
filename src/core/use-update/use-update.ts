import {
  getRootId,
  effectStoreHelper,
  wipRootHelper,
  nextUnitOfWorkHelper,
  componentFiberHelper,
  fromHookUpdateHelper,
  fiberMountHelper,
} from '@core/scope';
import {
  Fiber,
  EffectTag,
  mountInstance,
} from '@core/fiber';
import { platform } from '@core/global';


function useUpdate() {
  const rootId = getRootId();
  const currentFiber = componentFiberHelper.get();
  const update = () => {
    const callback = () => {
      effectStoreHelper.set(rootId); // important order!
      fromHookUpdateHelper.set(true);

      const fiber = new Fiber({
        ...currentFiber,
        child: null,
        alternate: currentFiber,
        effectTag: EffectTag.UPDATE,
      });

      currentFiber.alternate = null;
      wipRootHelper.set(fiber);
      componentFiberHelper.set(fiber);
      fiber.instance = mountInstance(fiber, fiber.instance);
      fiberMountHelper.reset();
      nextUnitOfWorkHelper.set(fiber);
    };

    platform.scheduleCallback(callback);
  };

  return [update];
}

export {
  useUpdate,
};
