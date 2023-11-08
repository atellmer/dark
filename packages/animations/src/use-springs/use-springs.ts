import { useMemo, useUpdate, useLayoutEffect, detectIsFunction, batch } from '@dark-engine/core';

import { type SpringValue } from '../shared';
import { type BaseOptions, type StartFn, Controller } from '../controller';
import { SharedState, Flow, getSharedState } from '../shared-state';
import { range } from '../utils';

export type ItemOptions<T extends string> = {
  outside?: (value: SpringValue<T>) => void;
  onStart?: () => void;
  onChange?: () => void;
  onEnd?: () => void;
} & BaseOptions<T>;

function useSprings<T extends string>(
  count: number,
  configurator: (idx: number) => ItemOptions<T>,
  deps: Array<any> = [],
): [Array<SpringValue<T>>, SpringsApi<T>] {
  const update = useUpdate();
  const forceUpdate = () => batch(update);
  const sharedState = useMemo(() => getSharedState() || new SharedState(), []);
  const scope = useMemo<Scope<T>>(() => {
    return {
      prevCount: count,
      ctrls: range(count).map(() => new Controller<T>(sharedState)),
      configurator,
    };
  }, []);

  scope.configurator = configurator;

  useMemo(() => {
    const { ctrls, configurator } = scope;

    prepare(ctrls, configurator, forceUpdate);
  }, deps);

  useLayoutEffect(() => {
    const { ctrls, prevCount, configurator } = scope;

    if (count > prevCount) {
      ctrls.push(...range(count - prevCount).map(() => new Controller<T>(sharedState)));
      prepare(ctrls, configurator, forceUpdate);
    } else if (count < prevCount) {
      ctrls.splice(count, ctrls.length);
      prepare(ctrls, configurator, forceUpdate);
    }

    forceUpdate();
    scope.prevCount = count;
  }, [count]);

  useLayoutEffect(() => {
    const { ctrls } = scope;
    const unsubs: Array<() => void> = [];

    ctrls.forEach((ctrl, idx) => {
      unsubs.push(
        ctrl.subscribe('start', () => {
          const { onStart } = scope.configurator(idx);

          detectIsFunction(onStart) && onStart();
        }),
      );
      unsubs.push(
        ctrl.subscribe('change', () => {
          const { onChange } = scope.configurator(idx);

          detectIsFunction(onChange) && onChange();
        }),
      );
      unsubs.push(
        ctrl.subscribe('end', () => {
          const { onEnd } = scope.configurator(idx);

          detectIsFunction(onEnd) && onEnd();
        }),
      );
    });

    return () => unsubs.forEach(x => x());
  }, [count]);

  useLayoutEffect(() => () => api.cancel(), []);

  const api = useMemo<SpringsApi<T>>(() => {
    const { ctrls } = scope;
    const canUse = (ctrl: Controller<T>) => Boolean(ctrl);

    return {
      start: (fn?: StartFn<T>) => {
        if (sharedState.getIsTrail()) {
          const [ctrl] = ctrls;

          if (!canUse(ctrl)) return;
          ctrl.setFlow(Flow.RIGHT);
          ctrl.start(fn);
        } else {
          ctrls.forEach(ctrl => {
            if (!canUse(ctrl)) return;
            ctrl.setFlow(Flow.RIGHT);
            ctrl.start(fn);
          });
        }
      },
      back: () => {
        if (sharedState.getIsTrail()) {
          const ctrl = ctrls[ctrls.length - 1];

          if (!canUse(ctrl)) return;
          ctrl.setFlow(Flow.LEFT);
          ctrl.back();
        } else {
          ctrls.forEach(ctrl => {
            if (!canUse(ctrl)) return;
            ctrl.setFlow(Flow.LEFT);
            ctrl.back();
          });
        }
      },
      toggle: (reverse = false) => {
        if (sharedState.getIsTrail()) {
          if (reverse) {
            const ctrl = ctrls[ctrls.length - 1];

            if (!canUse(ctrl)) return;
            ctrl.setFlow(Flow.LEFT);
            ctrl.toggle();
          } else {
            const [ctrl] = ctrls;

            if (!canUse(ctrl)) return;
            ctrl.setFlow(Flow.RIGHT);
            ctrl.toggle();
          }
        } else {
          ctrls.forEach(ctrl => {
            if (!canUse(ctrl)) return;
            ctrl.setFlow(Flow.RIGHT);
            ctrl.toggle();
          });
        }
      },
      pause: () => sharedState.pause(),
      resume: () => sharedState.resume(),
      reset: () => ctrls.forEach(ctrl => ctrl.reset()),
      cancel: () => ctrls.forEach(ctrl => ctrl.cancel()),
      loop: (isEnabled: boolean, withReset = false) => {
        sharedState.setIsLoop(isEnabled);
        sharedState.setWithReset(withReset);
      },
    };
  }, []);

  const values = scope.ctrls.map(x => x.getValue());

  return [values, api];
}

type Scope<T extends string> = {
  prevCount: number;
  ctrls: Array<Controller<T>>;
  configurator: (idx: number) => ItemOptions<T>;
};

export type SpringsApi<T extends string> = {
  start: (fn?: StartFn<T>) => void;
  back: () => void;
  toggle: (reverse?: boolean) => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  cancel: () => void;
  loop: (isEnabled: boolean, withReset?: boolean) => void;
};

function prepare<T extends string>(
  ctrls: Array<Controller<T>>,
  configurator: (idx: number) => ItemOptions<T>,
  update: () => void,
) {
  ctrls.forEach((ctrl, idx) => {
    const { from, to, config, outside } = configurator(idx);
    const left = ctrls[idx - 1] || null;
    const right = ctrls[idx + 1] || null;
    const notifier = detectIsFunction(outside) ? outside : () => update();

    ctrl.setIdx(idx);
    ctrl.setFrom(from);
    ctrl.setTo(to);
    ctrl.setSpringConfigFn(config);
    ctrl.setNotifier(notifier);
    ctrl.setConfigurator(configurator);
    ctrl.setLeft(left);
    ctrl.setRight(right);
  });
}

export { useSprings };
