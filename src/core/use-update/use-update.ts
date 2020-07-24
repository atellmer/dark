import {
  getRootId,
  effectStoreHelper,
  wipRootHelper,
  nextUnitOfWorkHelper,
  componentFiberHelper,
  fromHookUpdateHelper,
  fiberMountHelper,
  deletionsHelper,
  currentHookHelper,
} from '@core/scope';
import {
  EffectTag,
  Fiber,
  mountInstance,
} from '@core/fiber';


function useUpdate() {
  const rootId = getRootId();
  const getComponentFiber = componentFiberHelper.get();
  const update = () => {
    effectStoreHelper.set(rootId); // important order!
    fromHookUpdateHelper.set(true);

    const fiber = getComponentFiber();
    const wipFiber = new Fiber({
      ...fiber,
      alternate: fiber,
      effectTag: EffectTag.UPDATE,
    });

    fiber.alternate = null;
    wipRootHelper.set(wipFiber);
    currentHookHelper.set(fiber.hook);
    wipFiber.instance = mountInstance(fiber.instance, () => wipFiber);
    fiberMountHelper.reset();
    nextUnitOfWorkHelper.set(wipFiber);
    deletionsHelper.get().forEach(x => (x.effectTag = EffectTag.UPDATE));
    deletionsHelper.set([]);
  };

  return [update];
}

export {
  useUpdate,
};
