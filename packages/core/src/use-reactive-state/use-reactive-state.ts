import { type ScheduleCallbackOptions } from '../platform';
import { detectIsObject, detectIsNull, detectIsFunction } from '../helpers';
import { useUpdate } from '../use-update';
import { useMemo } from '../use-memo';
import { batch } from '../batch';
import { detectIsAtom } from '../use-atom';

function useReactiveState<T extends object>(value: T | (() => T), options?: ScheduleCallbackOptions) {
  if (!value) throw new Error('[Dark]: initial value is not object or array');
  const update = useUpdate(options);
  const proxy = useMemo(() => reactive(detectIsFunction(value) ? value() : value, update, !options?.forceSync), []);

  return proxy;
}

function reactive<T extends object>(value: T, update: () => void, useBatch = true): T {
  if (detectIsAtom(value)) return value;
  let proxy = value;

  if (detectIsObject(value) && !detectIsNull(value)) {
    const keys = Object.keys(value);

    proxy = new Proxy(value, {
      set: (target, prop, value) => {
        if (Object.is(target[prop], value)) return true;

        target[prop] = reactive(value, update, useBatch);

        useBatch ? batch(update) : update();

        return true;
      },
    });

    for (const key of keys) {
      value[key] = reactive(value[key], update);
    }
  }

  return proxy;
}

export { useReactiveState };
