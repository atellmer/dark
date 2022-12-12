import { detectIsObject, detectIsNull } from '../helpers';
import { useUpdate } from '../use-update';
import { useMemo } from '../use-memo';
import { batch } from '../batch';

function useReactiveState<T extends object>(value: T) {
  if (!value) {
    throw new Error('[Dark]: initial value is not object or array');
  }

  const update = useUpdate();
  const reactiveValue = useMemo(() => reactive(value, update), []);

  return reactiveValue;
}

function reactive<T extends object>(value: T, update: () => void): T {
  let patched: T = value;

  if (detectIsObject(value) && !detectIsNull(value)) {
    patched = new Proxy(value, {
      set: function (target, prop, value) {
        if (target[prop] === value) return true;

        target[prop] = reactive(value, update);

        batch(() => {
          update();
        });

        return true;
      },
    });

    for (const key of Object.keys(value)) {
      value[key] = reactive(value[key], update);
    }
  }

  return patched;
}

export { useReactiveState };
