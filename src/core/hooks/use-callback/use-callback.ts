import { getHooks, getMountedComponentId } from '@core/scope';
import { isUndefined, isFunction, isArray, error } from '@helpers';

type HookValue = {
	deps: Array<any>;
	value: Function;
};

function checkDeps(deps: Array<unknown>, prevDeps: Array<unknown>, onDifferentDeps: Function) {
	if (!isUndefined(deps) && !isUndefined(prevDeps) && deps.length > 0 && prevDeps.length > 0) {
		for (let i = 0; i < prevDeps.length; i++) {
			if (prevDeps[i] !== deps[i]) {
				onDifferentDeps();
				break;
			}
		}
	}
}

function useCallback(callback: Function, deps?: Array<any>): Function {
	if (!isFunction(callback)) {
		error('[Dark]: useCallback must take only function as first argument!');
		return;
	}
	if (!isUndefined(deps) && !isArray(deps)) {
		error('[Dark]: useCallback must take only array as deps!');
		return;
	}
	const componentId = getMountedComponentId();
	const hooks = getHooks(componentId);
	const idx = hooks.idx;

	if (isUndefined(hooks.values[idx])) {
		hooks.values[idx] = {
			deps,
			value: callback
		};

		hooks.idx++;
		return callback;
	}

	const hookValue: HookValue = hooks.values[idx];
	const prevDeps = hookValue.deps;

	checkDeps(deps, prevDeps, () => {
		hookValue.deps = deps;
		hookValue.value = callback;
	});

	hooks.idx++;

	return hookValue.value;
}

export default useCallback;
