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
  EffectTag,
  mountInstance,
} from '@core/fiber';
import { scheduler } from '../scheduler';


function useUpdate() {
  const rootId = getRootId();
  const fiber = componentFiberHelper.get();
  const update = () => {
    scheduler.scheduleTask({
      calllback: () => {
        effectStoreHelper.set(rootId); // important order!
        fromHookUpdateHelper.set(true);

        fiber.alternate = fiber;
        fiber.effectTag = EffectTag.UPDATE;

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
