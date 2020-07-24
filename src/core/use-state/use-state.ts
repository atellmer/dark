import {
  getRootId,
  effectStoreHelper,
  componentFiberHelper,
  currentHookHelper,
} from '@core/scope';
import { useUpdate } from '../use-update';
import { isUndefined } from '@helpers';


function useState<T = unknown>(initialValue: T): [T, (value: T) => void] {
  const rootId = getRootId();
  const getComponentFiber = componentFiberHelper.get();
  const hook = currentHookHelper.get();
  const { idx, values } = hook;
  const [update] = useUpdate();
  const value = !isUndefined(values[idx]) ? values[idx] : initialValue;
  const setState = (value: T) => {
    effectStoreHelper.set(rootId);

    const fiber = getComponentFiber();
    const hook = fiber.hook;
    const { values } = hook;

    values[idx] = value;
    update();
  }

  hook.idx++;

  return [value, setState];
}

export {
  useState,
};
