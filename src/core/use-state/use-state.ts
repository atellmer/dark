import {
  getRootId,
  effectStoreHelper,
  componentFiberHelper,
  currentHookHelper,
} from '@core/scope';
import { useUpdate } from '../use-update';
import { isUndefined, isFunction } from '@helpers';


type Value<T> = T | ((prevValue: T) => T);

function useState<T = unknown>(initialValue: T): [T, (value: Value<T>) => void] {
  const rootId = getRootId();
  const getComponentFiber = componentFiberHelper.get();
  const hook = currentHookHelper.get();
  const { idx, values } = hook;
  const [update] = useUpdate();
  const value = !isUndefined(values[idx]) ? values[idx] : initialValue;
  const setState = (value: Value<T>) => {
    effectStoreHelper.set(rootId);

    const fiber = getComponentFiber();
    const hook = fiber.hook;
    const { values } = hook;

    values[idx] = isFunction(value) ? value(values[idx] || initialValue) : value;
    update();
  }

  hook.idx++;

  return [value, setState];
}

export {
  useState,
};
