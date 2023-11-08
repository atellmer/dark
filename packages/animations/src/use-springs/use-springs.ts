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
    const options: UpdateCountOptions<T> = {
      count,
      prevCount,
      sharedState,
      ctrls,
      configurator,
      update: forceUpdate,
    };

    updateCount(options);
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
    const canUse = (controller: Controller<T>) => controller && !controller.getIsRemoved();

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
      pause: () => ctrls.forEach(ctrl => ctrl.pause()),
      resume: () => ctrls.forEach(ctrl => ctrl.resume()),
      reset: () => ctrls.forEach(ctrl => canUse(ctrl) && ctrl.reset()),
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
    const notifier = detectIsFunction(outside) ? outside : update;

    ctrl.setIdx(idx);
    ctrl.setFrom(from);
    ctrl.setTo(to);
    ctrl.setSpringConfigFn(config);
    ctrl.setNotifier(notifier);
    ctrl.setConfigurator(configurator);

    if (!ctrl.getIsRemoved()) {
      ctrl.setLeft(left);
      ctrl.setRight(right);
    }

    if (ctrl.getIsAdded()) {
      const { isPlaying } = ctrl.getAnimationStatus();
      const [first] = ctrls;

      ctrl.markAsAdded(false);

      if (!isPlaying) {
        if (first !== ctrl) {
          if (!first.detectIsReachedFrom()) {
            ctrl.setFlow(Flow.RIGHT);
            ctrl.start();
          }
        } else {
          ctrl.setFlow(Flow.RIGHT);
          ctrl.start();
        }
      }
    }
  });
}

type UpdateCountOptions<T extends string> = {
  count: number;
  prevCount: number;
  sharedState: SharedState;
  ctrls: Array<Controller<T>>;
  configurator: (idx: number) => ItemOptions<T>;
  update: () => void;
};

function updateCount<T extends string>(options: UpdateCountOptions<T>) {
  const { count, prevCount, sharedState, ctrls, configurator, update } = options;

  if (count > prevCount) {
    const diff = count - prevCount;
    const idx = ctrls.findIndex(x => x.getIsRemoved());
    const inserts = range(diff).map(() => {
      const ctrl = new Controller<T>(sharedState);

      ctrl.markAsAdded(true);

      return ctrl;
    });

    if (idx !== -1) {
      ctrls.splice(idx, 0, ...inserts);
    } else {
      ctrls.push(...inserts);
    }

    prepare(ctrls, configurator, update);
    update();
  } else if (count < prevCount) {
    const deleted = ctrls.slice(count, ctrls.length);
    const last = deleted[deleted.length - 1];

    for (let i = deleted.length - 1; i >= 0; i--) {
      const ctrl = deleted[i];
      const ctrl$ = deleted[i - 1];

      ctrl.markAsRemoved(true);
      ctrl.subscribe('end', () => {
        if (!ctrl.detectIsReachedFrom()) return;
        const idx = ctrls.findIndex(x => x === ctrl);

        if (idx !== -1) {
          ctrls.splice(idx, 1);
          prepare(ctrls, configurator, update);
          update();
        }
      });
      ctrl$ && ctrl.subscribe('change', value => ctrl$.start(() => ({ to: value })));
    }

    last.back();
  }
}

export { useSprings };