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
  EffectTag,
  mountInstance,
  workLoop,
} from '@core/fiber';
import { scheduler, UpdatorZone } from '../scheduler';


function useUpdate() {
  const rootId = getRootId();
  const fiber = componentFiberHelper.get();
  const update = () => {
    scheduler.scheduleUpdate({
      zone: UpdatorZone.LOCAL,
      run: (deadline: IdleDeadline) => {
        effectStoreHelper.set(rootId); // important order!
        fromHookUpdateHelper.set(true);

        fiber.alternate = fiber;
        fiber.effectTag = EffectTag.UPDATE;

        wipRootHelper.set(fiber);
        componentFiberHelper.set(fiber);
        fiber.instance = mountInstance(fiber.instance);
        fiberMountHelper.reset();
        nextUnitOfWorkHelper.set(fiber);
        deletionsHelper.get().forEach(x => (x.effectTag = EffectTag.UPDATE));
        deletionsHelper.set([]);
        workLoop({ deadline });
      },
    });
  };

  return [update];
}

export {
  useUpdate,
};
