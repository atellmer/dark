import { getHooks, getMountedComponentId } from '@core/scope';
import { isUndefined, isFunction, isArray, error, flatten } from '@helpers';
import { Component, getIsComponentFactory } from '../../component';
import { isVirtualNode } from '../../vdom/vnode';
import { MountedSource } from '../../vdom';
import { HookValue, getIsDepsDifferent } from '../shared';
import memo from '../../memo';

const isFlatMountedSource = (mountedSource: MountedSource): boolean =>
	getIsComponentFactory(mountedSource) || isVirtualNode(mountedSource);

function isMountedSource(mountedSource: MountedSource): boolean {
	return isArray(mountedSource)
		? flatten(mountedSource).some(isFlatMountedSource)
		: isFlatMountedSource(mountedSource);
}

function getMemoizedValue(getValue: () => any, deps?: Array<any>, prevDeps?: Array<any>): any {
	const value = getValue();

	if (isMountedSource(value)) {
		const component = getValue as Component<any>;
		const shouldUpdate = () => getIsDepsDifferent(deps, prevDeps);

		return memo(component, shouldUpdate)();
	}

	return value;
}

function useMemo(getValue: () => any, deps: Array<any>): any {
	if (!isFunction(getValue)) {
		error('[Dark]: useMemo must take only function as first argument!');
		return;
	}
	if (isUndefined(deps) || !isArray(deps)) {
		error('[Dark]: useMemo must take only array as deps!');
		return;
	}
	const componentId = getMountedComponentId();
	const hooks = getHooks(componentId);
	const idx = hooks.idx;

	if (isUndefined(hooks.values[idx])) {
		const value = getMemoizedValue(getValue, deps);

		hooks.values[idx] = { deps, value };
		hooks.idx++;

		return value;
	}

	const hookValue: HookValue = hooks.values[idx];
	const prevDeps = hookValue.deps;
	const isDepsDifferent = getIsDepsDifferent(deps, prevDeps);

	if (isDepsDifferent) {
		hookValue.deps = deps;
		hookValue.value = getMemoizedValue(getValue, deps, prevDeps);
	}

	hooks.idx++;

	return hookValue.value;
}

export default useMemo;
