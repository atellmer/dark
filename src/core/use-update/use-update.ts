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
  Fiber,
  mountInstance,
} from '@core/fiber';


function useUpdate() {
  const rootId = getRootId();
  const fiber = componentFiberHelper.get();
  const update = () => {
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
  };

  return [update];
}

export {
  useUpdate,
};
