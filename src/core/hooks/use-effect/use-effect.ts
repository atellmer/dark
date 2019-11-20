import {
  getHooks,
  getMountedComponentId,
} from '@core/scope';
import { isUndefined, isFunction, isArray } from '@helpers';

type Effect = () => void | Function;
type EffectValue = {
  deps: Array<any>;
  cleanup: void | Function;
}

function createEffectValue(deps: Array<any>, cleanup: void | Function): EffectValue {
  return {
    deps,
    cleanup,
  };
}

function runEffect(hooks: any, idx: number, deps: Array<any>, effect: Effect) {
  setTimeout(() => {
    const effectValue = hooks.values[idx] as EffectValue;
    const cleanup =  effectValue && effectValue.cleanup;

    isFunction(cleanup) && cleanup();
    hooks.values[idx] = createEffectValue(deps, effect());
  });
}

function useEffect(effect: Effect, deps?: Array<any>) {
  const hasDeps = isArray(deps);
  const componentId = getMountedComponentId();
  const hooks = getHooks(componentId);
  const idx = hooks.idx;

  if (isUndefined(hooks.values[idx])) {
    hooks.values[idx] = {};
    runEffect(hooks, idx, deps, effect);
  } else {
    if (hasDeps) {
      const effectValue = hooks.values[idx] as EffectValue; 
      const prevDeps = effectValue.deps;
      if (deps.length > 0 && isArray(prevDeps)) {        
        for (let i = 0; i < prevDeps.length; i++) {
          if (prevDeps[i] !== deps[i]) {
            runEffect(hooks, idx, deps, effect);
            break;
          }
        }
      } 
    } else {
      runEffect(hooks, idx, deps, effect);
    }
  }

  hooks.idx++;
}

export default useEffect;
