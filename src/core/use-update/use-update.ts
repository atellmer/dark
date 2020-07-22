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

    wipFiber.instance = mountInstance(fiber.instance, () => wipFiber);
    fiber.alternate = null;
    fiberMountHelper.reset();
    wipRootHelper.set(wipFiber);
    nextUnitOfWorkHelper.set(wipFiber);
    deletionsHelper.get().forEach(x => (x.effectTag = EffectTag.UPDATE));
    deletionsHelper.set([]);
  };

  return [update];
}

export {
  useUpdate,
};
