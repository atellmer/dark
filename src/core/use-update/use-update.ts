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
} from '@core/fiber';
import { ComponentFactory } from '@core/component';
import { flatten } from '@helpers';
import { DarkElementInstance } from '../shared/model';


function useUpdate() {
  const rootId = getRootId();
  const getComponentFiber = componentFiberHelper.get();

  const update = () => {
    effectStoreHelper.set(rootId); // important order!
    fromHookUpdateHelper.set(true);
    const fiber = getComponentFiber();
    const factory = fiber.instance as ComponentFactory;

    componentFiberHelper.set(() => fiber);
    factory.children = flatten([factory.type(factory.props)]) as Array<DarkElementInstance>;

    const wipFiber = new Fiber({
      ...fiber,
      instance: factory,
      alternate: fiber,
      effectTag: EffectTag.UPDATE,
    });

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
