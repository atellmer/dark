import {
  getRootId,
  effectStoreHelper,
  componentFiberHelper,
} from '@core/scope';
import { useUpdate } from '../use-update';
import { isUndefined, isFunction } from '@helpers';


type Value<T> = T | ((prevValue: T) => T);

function useState<T = unknown>(initialValue: T): [T, (value: Value<T>) => void] {
  const rootId = getRootId();
  const fiber = componentFiberHelper.get();
  const { hook } = fiber;
  const { idx, values } = hook;
  const [update] = useUpdate();
  const value = !isUndefined(values[idx]) ? values[idx] : initialValue;

  const setState = (value: Value<T>) => {
    effectStoreHelper.set(rootId);
    values[idx] = isFunction(value) ? value(values[idx]) : value;
    hook.update();
  }

  values[idx] = value;
  hook.update = update;
  hook.idx++;

  return [value, setState];
}

export {
  useState,
};
