import { useMemo, useLayoutEffect } from '@dark-engine/core';

import { type SpringItem } from '../shared';
import { type BaseOptions, type StartFn, Controller } from '../controller';
import { type AnimationEventName, type AnimationEventHandler, SharedState, getSharedState } from '../shared-state';
import { range } from '../utils';

export type ItemOptions<T extends string> = BaseOptions<T>;

function useSprings<T extends string>(
  count: number,
  configurator: (idx: number) => ItemOptions<T>,
): [Array<SpringItem<T>>, SpringsApi<T>] {
  const state = useMemo(() => getSharedState() || new SharedState(), []);
  const scope = useMemo(() => {
    return {
      configurator,
      prevCount: count,
      ctrls: range(count).map(() => new Controller<T>(state)),
    };
  }, []);

  scope.configurator = configurator;

  useMemo(() => {
    const { ctrls, prevCount } = scope;
    const configurator = (idx: number) => scope.configurator(idx);

    if (count > prevCount) {
      ctrls.push(...range(count - prevCount).map(() => new Controller<T>(state)));
    } else if (count < prevCount) {
      const deleted = ctrls.splice(count, ctrls.length);

      deleted.forEach(ctrl => ctrl.setIsPlaying(false));
    }

    state.setCtrls(ctrls);
    scope.prevCount = count;
    prepare(ctrls, configurator);
  }, [count]);

  useLayoutEffect(() => () => api.cancel(), []);

  const api = useMemo<SpringsApi<T>>(() => {
    return {
      start: state.start.bind(state),
      back: state.back.bind(state),
      toggle: state.toggle.bind(state),
      loop: state.loop.bind(state),
      delay: state.delay.bind(state),
      pause: state.pause.bind(state),
      resume: state.resume.bind(state),
      reset: state.reset.bind(state),
      cancel: state.cancel.bind(state),
      on: state.on.bind(state),
      once: state.once.bind(state),
    };
  }, []);

  const items = scope.ctrls.map(ctrl => ({
    ctrl,
    getValue: () => ctrl.getValue(),
    detectIsActive: () => state.detectIsPlaying(),
  }));

  return [items, api];
}

function prepare<T extends string>(ctrls: Array<Controller<T>>, configurator: (idx: number) => ItemOptions<T>) {
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

export type SpringsApi<T extends string = string> = {
  start: (fn?: StartFn<T>) => void;
  back: () => void;
  toggle: (isReversed?: boolean) => void;
  loop: (isEnabled: boolean, withReset?: boolean) => void;
  delay: (timeout: number) => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  cancel: () => void;
  on: (event: AnimationEventName, handler: AnimationEventHandler<T>) => () => void;
  once: (event: AnimationEventName, handler: AnimationEventHandler<T>) => void;
};

export { useSprings };
