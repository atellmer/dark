import {
  getRootId,
  effectStoreHelper,
  componentFiberHelper,
} from '@core/scope';
import { useUpdate } from '@core/use-update';
import { isUndefined, isFunction } from '@helpers';


type Value<T> = T | ((prevValue: T) => T);

function useState<T = unknown>(initialValue: T): [T, (value: Value<T>) => void] {
  const rootId = getRootId();
  const fiber = componentFiberHelper.get();
  const { hook } = fiber;
  const { idx, values } = hook;
  const [update] = useUpdate();
  const value = !isUndefined(values[idx]) ? values[idx] : initialValue;
  const setState = (sourceValue: Value<T>) => {
    effectStoreHelper.set(rootId);
    const value = values[idx];
    const newValue = isFunction(sourceValue) ? sourceValue(value) : sourceValue;

    if (!Object.is(value, newValue)) {
      hook.update();
    }

    values[idx] = newValue;
  };

  values[idx] = value;
  hook.update = update;
  hook.idx++;

  return [value, setState];
}

export {
  useState,
};
