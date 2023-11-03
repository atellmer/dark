import { useMemo, useUpdate, useLayoutEffect, detectIsFunction, batch } from '@dark-engine/core';

import { type Updater, SharedState, MotionController, Flow } from '../controller';
import { type SpringValue } from '../shared';
import { type UseMotionOptions } from '../use-motion';
import { range } from '../utils';

type TrailItemOptions<T extends string> = Pick<UseMotionOptions<T>, 'from' | 'to' | 'config' | 'outside'>;

type Scope<T extends string> = {
  prevCount: number;
  controllers: Array<MotionController<T>>;
};

function useTrail<T extends string>(
  count: number,
  configurator: (idx: number) => TrailItemOptions<T>,
  deps: Array<any> = [],
): [Array<SpringValue<T>>, TrailApi<T>] {
  const update = useUpdate();
  const shared = useMemo(() => new SharedState(true), []);
  const scope = useMemo<Scope<T>>(() => {
    return {
      prevCount: count,
      controllers: range(count).map(() => new MotionController<T>(shared)),
    };
  }, []);

  useMemo(() => {
    setupControllers(scope.controllers, configurator, update);
  }, deps);

  const api = useMemo<TrailApi<T>>(() => {
    const { controllers } = scope;

    return {
      start: (fn?: Updater<T>) => {
        const [controller] = controllers;

        if (!controller) return;
        controller.setFlow(Flow.RIGHT);
        controller.start(fn);
      },
      reverse: () => {
        const controller = controllers[controllers.length - 1];

        if (!controller) return;
        controller.setFlow(Flow.LEFT);
        controller.reverse();
      },
      toggle: (reverse = false) => {
        if (reverse) {
          const controller = controllers[controllers.length - 1];

          if (!controller) return;
          controller.setFlow(Flow.LEFT);
          controller.toggle();
        } else {
          const [controller] = controllers;

          if (!controller) return;
          controller.setFlow(Flow.RIGHT);
          controller.toggle();
        }
      },
    };
  }, []);

  useLayoutEffect(() => {
    const { controllers, prevCount } = scope;
    const options: UpdateCountOptions<T> = {
      count,
      prevCount,
      shared,
      controllers,
      configurator,
      update: () => batch(update),
    };

    updateCount(options);
    scope.prevCount = count;
  }, [count]);

  useLayoutEffect(
    () => () => {
      scope.controllers.map(x => x.cancel());
    },
    [],
  );

  const values = scope.controllers.map(x => x.getValue());

  return [values, api];
}

function setupControllers<T extends string>(
  controllers: Array<MotionController<T>>,
  configurator: (idx: number) => TrailItemOptions<T>,
  update: () => void,
) {
  controllers.forEach((controller, idx) => {
    const { from, to, config, outside } = configurator(idx);
    const left = controllers[idx - 1] || null;
    const right = controllers[idx + 1] || null;
    const notifier = detectIsFunction(outside) ? outside : () => batch(update);

    controller.setKey(String(idx + 1));
    controller.setFrom(from);
    controller.setTo(to);
    controller.setConfigFn(config);
    controller.setNotifier(notifier);

    if (!controller.getIsRemoved()) {
      controller.setLeft(left);
      controller.setRight(right);
    }

    if (controller.getIsAdded()) {
      controller.setIsAdded(false);
      controller.start();
    }
  });
}

type UpdateCountOptions<T extends string> = {
  count: number;
  prevCount: number;
  shared: SharedState;
  controllers: Array<MotionController<T>>;
  configurator: (idx: number) => TrailItemOptions<T>;
  update: () => void;
};

function updateCount<T extends string>(options: UpdateCountOptions<T>) {
  const { count, prevCount, shared, controllers, configurator, update } = options;

  if (count > prevCount) {
    const diff = count - prevCount;
    const idx = controllers.findIndex(x => x.getIsRemoved());
    const inserts = range(diff).map(() => {
      const controller = new MotionController<T>(shared);

      controller.setIsAdded(true);

      return controller;
    });

    if (idx !== -1) {
      controllers.splice(idx, 0, ...inserts);
    } else {
      controllers.push(...inserts);
    }

    setupControllers(controllers, configurator, update);
  } else if (count < prevCount) {
    const deleted = controllers.slice(count, controllers.length);

    deleted.forEach(controller => {
      controller.setIsRemoved(true);
      controller.reverse();
      controller.subscribe('end', () => {
        if (controller.detectIsReachedFrom()) {
          const idx = controllers.findIndex(x => x === controller);

          if (idx !== -1) {
            controllers.splice(idx, 1);
            setupControllers(controllers, configurator, update);
            update();
          }
        }
      });
    });
  }
}

export type TrailApi<T extends string> = {
  start: (fn?: Updater<T>) => void;
  reverse: () => void;
  toggle: (reverse?: boolean) => void;
};

export { useTrail };
