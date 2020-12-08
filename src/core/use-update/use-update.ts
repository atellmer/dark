import {
  getRootId,
  effectStoreHelper,
  wipRootHelper,
  nextUnitOfWorkHelper,
  componentFiberHelper,
  fromHookUpdateHelper,
  fiberMountHelper,
  deletionsHelper,
} from '@core/scope';
import {
  Fiber,
  EffectTag,
  mountInstance,
} from '@core/fiber';
import { scheduler } from '../scheduler';


function useUpdate() {
  const rootId = getRootId();
  const rootFiber = componentFiberHelper.get();
  const update = () => {
    scheduler.scheduleTask({
      calllback: () => {
        effectStoreHelper.set(rootId); // important order!
        fromHookUpdateHelper.set(true);

        const fiber = new Fiber({
          ...rootFiber,
          alternate: rootFiber,
          effectTag: EffectTag.UPDATE,
        });

        if (fiber.child) {
          fiber.child.parent = fiber;
          fiber.alternate.child.parent = null;

          let nextFiber = fiber.child.nextSibling;

          while (nextFiber) {
            nextFiber.parent = fiber;
            nextFiber = nextFiber.nextSibling;
          }
        }

        wipRootHelper.set(fiber);
        componentFiberHelper.set(fiber);
        fiber.instance = mountInstance(fiber.instance);
        fiberMountHelper.reset();
        nextUnitOfWorkHelper.set(fiber);
        deletionsHelper.get().forEach(x => (x.effectTag = EffectTag.UPDATE));
        deletionsHelper.set([]);
      },
    });
  };

  return [update];
}

export {
  useUpdate,
};
