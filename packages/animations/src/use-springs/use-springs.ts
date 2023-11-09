import { useMemo, useLayoutEffect, detectIsFunction } from '@dark-engine/core';

import { type SpringItem } from '../shared';
import { type BaseOptions, type StartFn, Controller } from '../controller';
import { SharedState, Flow, getSharedState } from '../shared-state';
import { range } from '../utils';

export type ItemOptions<T extends string> = {
  onStart?: () => void;
  onChange?: () => void;
  onEnd?: () => void;
} & BaseOptions<T>;

function useSprings<T extends string>(
  count: number,
  configurator: (idx: number) => ItemOptions<T>,
): [Array<SpringItem<T>>, SpringsApi<T>] {
  const state = useMemo(() => getSharedState() || new SharedState(), []);
  const scope = useMemo<Scope<T>>(() => {
    return {
      configurator,
      prevCount: count,
      ctrls: range(count).map(() => new Controller<T>(state)),
    };
  }, []);

  scope.configurator = configurator;

  useMemo(() => {
    const { ctrls, prevCount, configurator } = scope;

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

    return {
      start: createStart(ctrls),
      back: createBack(ctrls),
      toggle: createToggle(ctrls),
      loop: (isEnabled: boolean) => state.setIsLoop(isEnabled),
      pause: () => state.pause(),
      resume: () => state.resume(),
      reset: () => ctrls.forEach(ctrl => ctrl.reset()),
      cancel: () => ctrls.forEach(ctrl => ctrl.cancel()),
    };
  }, []);

  const items = scope.ctrls.map(ctrl => ({ ctrl, value: ctrl.getValue() }));

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

function createStart<T extends string>(ctrls: Array<Controller<T>>) {
  return (fn?: StartFn<T>) => {
    const [ctrl] = ctrls;

    if (!ctrl) return;
    if (ctrl.getIsTrail()) {
      ctrl.setFlow(Flow.RIGHT);
      ctrl.start(fn);
    } else {
      ctrls.forEach(ctrl => {
        ctrl.setFlow(Flow.RIGHT);
        ctrl.start(fn);
      });
    }
  };
}

function createBack<T extends string>(ctrls: Array<Controller<T>>) {
  return () => {
    const [ctrl] = ctrls;

    if (!ctrl) return;
    if (ctrl.getIsTrail()) {
      const ctrl = ctrls[ctrls.length - 1];

      ctrl.setFlow(Flow.LEFT);
      ctrl.back();
    } else {
      ctrls.forEach(ctrl => {
        ctrl.setFlow(Flow.LEFT);
        ctrl.back();
      });
    }
  };
}

function createToggle<T extends string>(ctrls: Array<Controller<T>>) {
  return (reverse: boolean) => {
    const [ctrl] = ctrls;

    if (!ctrl) return;
    if (ctrl.getIsTrail()) {
      if (reverse) {
        const ctrl = ctrls[ctrls.length - 1];

        ctrl.setFlow(Flow.LEFT);
        ctrl.toggle();
      } else {
        const [ctrl] = ctrls;

        ctrl.setFlow(Flow.RIGHT);
        ctrl.toggle();
      }
    } else {
      ctrls.forEach(ctrl => {
        ctrl.setFlow(Flow.RIGHT);
        ctrl.toggle();
      });
    }
  };
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
  loop: (isEnabled: boolean) => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  cancel: () => void;
};

export { useSprings };
