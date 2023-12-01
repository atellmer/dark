import { type Callback, useMemo, useLayoutEffect, useEffect } from '@dark-engine/core';

import { type AnimationEventName, type AnimationEventHandler, SharedState, getSharedState } from '../state';
import { type BaseItemConfig, type StartFn, Controller } from '../controller';
import { type Spring } from '../spring';
import { range } from '../utils';

export type SpringItemConfig<T extends string> = BaseItemConfig<T>;

function useSprings<T extends string>(
  count: number,
  configurator: SpringConfiguratorFn<T>,
  deps?: Array<any>,
): [Array<Spring<T>>, SpringApi<T>] {
  const state = useMemo(() => getSharedState() || new SharedState(), []);
  const scope = useMemo<Scope<T>>(() => {
    return {
      configurator,
      prevCount: count,
      ctrls: range(count).map(() => new Controller<T>(state)),
      inChain: false,
      pending: null,
    };
  }, []);

  scope.configurator = configurator;

  const springs = useMemo(() => {
    const configurator = (idx: number) => scope.configurator(idx);
    const { ctrls, prevCount } = scope;

    if (count > prevCount) {
      ctrls.push(...range(count - prevCount).map(() => new Controller<T>(state)));
    } else if (count < prevCount) {
      const deleted = ctrls.splice(count, ctrls.length);

      deleted.forEach(ctrl => ctrl.setIsPlaying(false));
    }

    state.setCtrls(ctrls);
    scope.prevCount = count;
    prepare(ctrls, configurator);

    return ctrls.map(ctrl => ctrl.getSpring());
  }, [count]);

  const api = useMemo<SpringApi<T>>(() => {
    return {
      start: fn => {
        if (scope.inChain) {
          scope.pending && scope.pending();
          scope.pending = null;
        } else {
          state.start(fn);
        }
      },
      chain: (value: boolean) => (scope.inChain = value),
      delay: state.delay.bind(state),
      pause: state.pause.bind(state),
      resume: state.resume.bind(state),
      reset: state.reset.bind(state),
      cancel: state.cancel.bind(state),
      on: state.on.bind(state),
      isCanceled: state.getIsCanceled.bind(state),
    };
  }, []);

  useEffect(() => {
    if (!deps) return;
    const { inChain } = scope;

    if (inChain) {
      scope.pending = () => state.start();
    } else {
      state.start();
    }
  }, deps || []);

  useLayoutEffect(() => () => api.cancel(), []);

  return [springs, api];
}

function prepare<T extends string>(ctrls: Array<Controller<T>>, configurator: (idx: number) => SpringItemConfig<T>) {
  ctrls.forEach((ctrl, idx) => {
    const { from, to, config } = configurator(idx);
    const left = ctrls[idx - 1] || null;
    const right = ctrls[idx + 1] || null;

    ctrl.setIdx(idx);
    ctrl.setFrom(from);
    ctrl.setTo(to);
    ctrl.setSpringConfigFn(config);
    ctrl.setConfigurator(configurator);
    ctrl.setLeft(left);
    ctrl.setRight(right);
  });
}

type SpringConfiguratorFn<T extends string> = (idx: number) => SpringItemConfig<T>;

type Scope<T extends string> = {
  prevCount: number;
  configurator: SpringConfiguratorFn<T>;
  ctrls: Array<Controller<T>>;
  inChain: boolean;
  pending: Callback;
};

export type SpringApi<T extends string = string> = {
  start: (fn?: StartFn<T>) => void;
  chain: (value: boolean) => void;
  delay: (timeout: number) => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  cancel: () => void;
  on: (event: AnimationEventName, handler: AnimationEventHandler<T>) => () => void;
  isCanceled: () => void;
};

export { useSprings };
