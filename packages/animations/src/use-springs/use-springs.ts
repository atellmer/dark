import { useMemo, useUpdate, useLayoutEffect, detectIsFunction, batch } from '@dark-engine/core';

import { type SpringValue } from '../shared';
import { type Updater, type PartialPhysicConfigFn, Controller } from '../controller';
import { SharedState, Flow, getSharedState } from '../shared-state';
import { range } from '../utils';

export type ItemConfig<T extends string> = {
  from: SpringValue<T>;
  to?: SpringValue<T>;
  config?: PartialPhysicConfigFn<T>;
  outside?: (value: SpringValue<T>) => void;
  onStart?: (idx: number) => void;
  onChange?: (idx: number) => void;
  onEnd?: (idx: number) => void;
};

function useSprings<T extends string>(
  count: number,
  configurator: (idx: number) => ItemConfig<T>,
  deps: Array<any> = [],
): [Array<SpringValue<T>>, SpringsApi<T>] {
  const update = useUpdate();
  const forceUpdate = () => batch(update);
  const shared = useMemo(() => getSharedState() || new SharedState(), []);
  const scope = useMemo<Scope<T>>(() => {
    return {
      prevCount: count,
      ctrls: range(count).map(() => new Controller<T>(shared)),
    };
  }, []);

  useMemo(() => {
    prepare(scope.ctrls, configurator, forceUpdate);
  }, deps);

  useLayoutEffect(() => {
    const { ctrls, prevCount } = scope;
    const options: UpdateCountOptions<T> = {
      count,
      prevCount,
      shared,
      ctrls,
      configurator,
      update: forceUpdate,
    };

    updateCount(options);
    scope.prevCount = count;
  }, [count]);

  useLayoutEffect(() => {
    const unsubs: Array<() => void> = [];

    scope.ctrls.forEach((ctrl, idx) => {
      const { onStart, onChange, onEnd } = configurator(idx);

      detectIsFunction(onStart) && unsubs.push(ctrl.subscribe('start', () => onStart(idx)));
      detectIsFunction(onChange) && unsubs.push(ctrl.subscribe('change', () => onChange(idx)));
      detectIsFunction(onEnd) && unsubs.push(ctrl.subscribe('end', () => onEnd(idx)));
    });

    return () => unsubs.forEach(x => x());
  }, [count]);

  useLayoutEffect(() => () => api.cancel(), []);

  const api = useMemo<SpringsApi<T>>(() => {
    const { ctrls } = scope;
    const canUse = (controller: Controller<T>) => controller && !controller.getIsRemoved();

    return {
      start: (fn?: Updater<T>) => {
        if (shared.getIsTrail()) {
          const [ctrl] = ctrls;

          if (!canUse(ctrl)) return;
          ctrl.setFlow(Flow.RIGHT);
          ctrl.start(fn, 0);
        } else {
          ctrls.forEach((ctrl, idx) => {
            if (!canUse(ctrl)) return;
            ctrl.start(fn, idx);
          });
        }
      },
      back: () => {
        if (shared.getIsTrail()) {
          const ctrl = ctrls[ctrls.length - 1];

          if (!canUse(ctrl)) return;
          ctrl.setFlow(Flow.LEFT);
          ctrl.back();
        } else {
          ctrls.forEach((ctrl, idx) => {
            if (!canUse(ctrl)) return;
            ctrl.back(idx);
          });
        }
      },
      toggle: (reverse = false) => {
        if (shared.getIsTrail()) {
          if (reverse) {
            const controller = ctrls[ctrls.length - 1];

            if (!canUse(controller)) return;
            controller.setFlow(Flow.LEFT);
            controller.toggle();
          } else {
            const [controller] = ctrls;

            if (!canUse(controller)) return;
            controller.setFlow(Flow.RIGHT);
            controller.toggle();
          }
        } else {
          ctrls.forEach((ctrl, idx) => {
            if (!canUse(ctrl)) return;
            ctrl.toggle(idx);
          });
        }
      },
      pause: () => ctrls.forEach(ctrl => ctrl.pause()),
      resume: () => ctrls.forEach(ctrl => ctrl.resume()),
      reset: () => ctrls.forEach(ctrl => canUse(ctrl) && ctrl.reset()),
      cancel: () => ctrls.forEach(ctrl => ctrl.cancel()),
    };
  }, []);

  const values = scope.ctrls.map(x => x.getValue());

  return [values, api];
}

type Scope<T extends string> = {
  prevCount: number;
  ctrls: Array<Controller<T>>;
};

type SpringsApi<T extends string> = {
  start: (fn?: Updater<T>) => void;
  back: () => void;
  toggle: (reverse?: boolean) => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  cancel: () => void;
};

function prepare<T extends string>(
  ctrls: Array<Controller<T>>,
  configurator: (idx: number) => ItemConfig<T>,
  update: () => void,
) {
  ctrls.forEach((ctrl, idx) => {
    const { from, to, config, outside } = configurator(idx);
    const left = ctrls[idx - 1] || null;
    const right = ctrls[idx + 1] || null;
    const notifier = detectIsFunction(outside) ? outside : update;

    ctrl.setKey(String(idx));
    ctrl.setFrom(from);
    ctrl.setTo(to);
    ctrl.setConfigFn(config);
    ctrl.setNotifier(notifier);
    ctrl.setConfigurator(configurator);

    if (!ctrl.getIsRemoved()) {
      ctrl.setLeft(left);
      ctrl.setRight(right);
    }

    if (ctrl.getIsAdded()) {
      ctrl.setIsAdded(false);
      ctrl.start();
    }
  });
}

type UpdateCountOptions<T extends string> = {
  count: number;
  prevCount: number;
  shared: SharedState;
  ctrls: Array<Controller<T>>;
  configurator: (idx: number) => ItemConfig<T>;
  update: () => void;
};

function updateCount<T extends string>(options: UpdateCountOptions<T>) {
  const { count, prevCount, shared, ctrls, configurator, update } = options;

  if (count > prevCount) {
    const diff = count - prevCount;
    const idx = ctrls.findIndex(x => x.getIsRemoved());
    const inserts = range(diff).map(() => {
      const controller = new Controller<T>(shared);

      controller.setIsAdded(true);

      return controller;
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

      ctrl.setIsRemoved(true);
      ctrl.subscribe('end', () => {
        if (!ctrl.detectIsReachedFrom()) return;
        const idx = ctrls.findIndex(x => x === ctrl);

        if (idx !== -1) {
          ctrls.splice(idx, 1);
          prepare(ctrls, configurator, update);
          update();
        }
      });
      ctrl$ && ctrl.subscribe('change', value => ctrl$.start(() => value));
    }

    last.back();
  }
}

export { useSprings };
