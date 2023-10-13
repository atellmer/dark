import { detectIsObject, detectIsNull, detectIsFunction } from '../helpers';
import { type UseUpdateOptions, useUpdate } from '../use-update';
import { useMemo } from '../use-memo';
import { detectIsAtom } from '../atom';

const $$proxy = Symbol('proxy');

function useReactiveState<T extends object>(value: T | (() => T), options?: UseUpdateOptions) {
  if (process.env.NODE_ENV !== 'production') {
    if (!value) throw new Error('[Dark]: initial value is not object or array');
  }
  const update = useUpdate(options);
  const proxy = useMemo(() => reactive(detectIsFunction(value) ? value() : value, update), []);

  return proxy;
}

function reactive<T extends object>(value: T, update: () => void): T {
  if (detectIsAtom(value) || detectIsProxy(value)) return value;
  let proxy = value;

  if (detectIsObject(value) && !detectIsNull(value)) {
    const keys = Object.keys(value);

    proxy = new Proxy(value, {
      get: (target, key) => key === $$proxy || target[key],
      set: (target, key, value) => {
        if (Object.is(target[key], value)) return true;

        target[key] = reactive(value, update);

        update();

        return true;
      },
    });

    for (const key of keys) {
      value[key] = reactive(value[key], update);
    }
  }

  return proxy;
}

const detectIsProxy = (value: object) => Boolean(value[$$proxy]);

export { useReactiveState, detectIsProxy };
