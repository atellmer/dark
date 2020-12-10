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
import { scheduler } from '../scheduler';


function useUpdate() {
  const rootId = getRootId();
  const currentFiber = componentFiberHelper.get();
  const update = () => {
    scheduler.scheduleTask({
      calllback: () => {
        let nextFiber: Fiber = null;
        effectStoreHelper.set(rootId); // important order!
        fromHookUpdateHelper.set(true);

        const fiber = new Fiber({
          ...currentFiber,
          alternate: currentFiber,
          effectTag: EffectTag.UPDATE,
        });

        currentFiber.alternate = null;
        nextFiber = fiber.child;

        while (nextFiber) {
          nextFiber.parent = fiber;
          nextFiber = nextFiber.nextSibling;
        }

        wipRootHelper.set(fiber);
        componentFiberHelper.set(fiber);
        fiber.instance = mountInstance(fiber, fiber.instance);
        fiberMountHelper.reset();
        nextUnitOfWorkHelper.set(fiber);
      },
    });
  };

  return [update];
}

export {
  useUpdate,
};
