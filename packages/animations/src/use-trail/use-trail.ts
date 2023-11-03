import { useMemo, useUpdate, useLayoutEffect, detectIsFunction, batch } from '@dark-engine/core';

import { type Updater, SharedState, MotionController, Flow } from '../controller';
import { type SpringValue } from '../shared';
import { type UseMotionOptions } from '../use-motion';
import { range } from '../utils';

type TrailItemOptions<T extends string> = Pick<UseMotionOptions<T>, 'from' | 'to' | 'config' | 'outside'>;

type Scope<T extends string> = {
  queue: Array<() => void>;
  isChangeCons: boolean;
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
      queue: [],
      isChangeCons: false,
      controllers: range(count).map(key => new MotionController<T>(String(key), shared)),
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

  useMemo(() => {
    const { queue, controllers, isChangeCons } = scope;
    const execute = () => {
      const fn = queue.shift();

      if (fn) {
        scope.isChangeCons = true;
        fn();
      } else {
        scope.isChangeCons = false;
      }
    };

    queue.push(() => changeConnections({ count, shared, controllers, configurator, update, execute }));
    !isChangeCons && execute();
  }, [count]);

  useLayoutEffect(
    () => () => {
      scope.controllers.map(x => x.cancel());
      scope.queue = [];
    },
    [],
  );

  const values = scope.controllers.map(x => x.getValue());

  return [values, api];
}

type ChangeConnectionsOptions<T extends string> = {
  count: number;
  shared: SharedState;
  controllers: Array<MotionController<T>>;
  configurator: (idx: number) => TrailItemOptions<T>;
  update: () => void;
  execute: () => void;
};

function changeConnections<T extends string>(options: ChangeConnectionsOptions<T>) {
  const { count, shared, controllers, configurator, update, execute } = options;

  if (count === controllers.length) return execute();

  const diff = Math.abs(count - controllers.length);

  if (count > controllers.length) {
    let key = controllers.length > 0 ? Number(controllers[controllers.length - 1].getKey()) : -1;

    controllers.push(
      ...range(diff).map(() => {
        const controller = new MotionController<T>(String(++key), shared);

        controller.setIsAdded(true);

        return controller;
      }),
    );

    setupControllers(controllers, configurator, update);
    execute();
  } else {
    if (controllers.length > 0) {
      controllers[controllers.length - 1].setRight(null);
    }

    controllers.splice(count, controllers.length);
    setupControllers(controllers, configurator, update);
    update();
    execute();
  }
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
    const notifier = detectIsFunction(outside) ? outside : () => batch(() => update());

    controller.setFrom(from);
    controller.setTo(to);
    controller.setConfigFn(config);

    if (!controller.getIsRemoved()) {
      controller.setLeft(left);
      controller.setRight(right);
    }

    controller.setNotifier(notifier);

    if (controller.getIsAdded()) {
      controller.setFlow(Flow.RIGHT);
      controller.setIsAdded(false);
      controller.start();
    }
  });
}

export type TrailApi<T extends string> = {
  start: (fn?: Updater<T>) => void;
  reverse: () => void;
  toggle: (reverse?: boolean) => void;
};

export { useTrail };
