import { detectIsObject, detectIsNull } from '../helpers';
import { useUpdate } from '../use-update';
import { useMemo } from '../use-memo';

type Scope = {
  timerId: number | null;
};

function useReactiveState<T extends object>(value: T) {
  if (!value) {
    throw new Error('[Dark]: initial value is not object or array');
  }

  const update = useUpdate();
  const scope = useMemo<Scope>(() => ({ timerId: null }), []);
  const reactiveValue = useMemo(() => reactive(value, scope, update), []);

  return reactiveValue;
}

function reactive<T extends object>(value: T, scope: Scope, update: () => void): T {
  let patched: T = value;

  if (detectIsObject(value) && !detectIsNull(value)) {
    patched = new Proxy(value, {
      set: function (target, prop, value) {
        if (target[prop] === value) return true;

        target[prop] = reactive(value, scope, update);

        scope.timerId && window.clearTimeout(scope.timerId);
        scope.timerId = window.setTimeout(() => {
          update();
        });

        return true;
      },
    });

    for (const key of Object.keys(value)) {
      value[key] = reactive(value[key], scope, update);
    }
  }

  return patched;
}

export { useReactiveState };
