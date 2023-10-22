import { platform, useMemo, useUpdate } from '@dark-engine/core';

import { type Config } from '../shared';
import { presets } from '../presets';
import { time, fix } from '../utils';

type UseMotionOptions<T extends string> = {
  from: Record<T, number>;
  to: Record<T, number>;
  config?: Partial<Config>;
};

function useMotion<T extends string>(options: UseMotionOptions<T>): [Record<T, number>, Api] {
  const { from, to, config: partialConfig = defaultConfig } = options;
  const update = useUpdate();
  const scope = useMemo<Scope<T>>(
    () => ({
      springs: { ...from },
      prevSprings: null,
      isForward: null,
      lastTime: null,
      rafId: null,
      results: null,
      completed: null,
      config: { ...defaultConfig, ...partialConfig },
    }),
    [],
  );
  const { precision } = scope.config;
  const springs = transformSprings(scope.springs, precision);

  const play = (to: Record<T, number>) => {
    const from = scope.springs;

    scope.results = {};
    scope.completed = {};

    run({
      from,
      to,
      scope,
      onLoop: () => detectAreSpringsDifferent(scope.prevSprings, scope.springs, precision) && update(),
    });
  };

  const api: Api = {
    start: () => {
      scope.isForward = true;
      play(to);
    },
    reverse: () => {
      scope.isForward = false;
      play(from);
    },
    toggle: () => {
      const { isForward } = scope;

      scope.isForward = !isForward;
      play(isForward === null ? to : isForward ? from : to);
    },
  };

  return [springs, api];
}

type Scope<T extends string> = {
  springs: Record<T, number>;
  prevSprings: Record<T, number>;
  isForward: boolean | null;
  lastTime: number;
  rafId: number;
  results: Record<string, [number, number]>;
  completed: Record<string, boolean>;
  config: Config;
};

type Api = {
  start: () => void;
  reverse: () => void;
  toggle: () => void;
};

type RunOptions<T extends string> = {
  from: Record<T, number>;
  to: Record<T, number>;
  scope: Scope<T>;
  onLoop: () => void;
};

function run<T extends string>(options: RunOptions<T>, fromLoop = false) {
  const { from, to, scope, onLoop } = options;
  const { springs, results, completed, config } = scope;
  const keys = Object.keys(springs);

  scope.prevSprings = { ...springs };

  if (!fromLoop) {
    scope.rafId && platform.caf(scope.rafId);
    scope.lastTime = time();
  }

  scope.rafId = platform.raf(() => {
    const currentTime = time();
    const deltaTime = (currentTime - scope.lastTime) / 1000;

    scope.lastTime = currentTime;

    for (const key of keys) {
      if (!results[key]) {
        results[key] = [from[key], 0];
      }

      let position = results[key][0];
      let velocity = results[key][1];
      const destination: number = to[key];

      [position, velocity] = stepper({ position, velocity, destination, config, step: deltaTime });

      results[key] = [position, velocity];

      if (position === destination) {
        completed[key] = true;
      }

      springs[key] = position;
    }

    onLoop();

    if (Object.keys(completed).length !== keys.length) {
      run(options, true);
    }
  });
}

const defaultConfig: Config = {
  ...presets.noWobble,
  mass: 1,
  precision: 2,
};

type StepperOptions = {
  position: number;
  velocity: number;
  destination: number;
  step: number;
  config: Partial<Config>;
};

function stepper(options: StepperOptions) {
  const {
    destination,
    step,
    position,
    velocity,
    config: { tension, friction, mass, precision },
  } = options;
  const displacement = position - destination;
  const springForce = -tension * displacement;
  const dampingForce = -friction * velocity;
  const acceleration = (springForce + dampingForce) / mass;
  const newVelocity = velocity + acceleration * step;
  const newPosition = position + newVelocity * step;

  if (Math.abs(displacement) < 10 ** -precision) {
    return [destination, 0];
  }

  return [newPosition, newVelocity];
}

function transformSprings<T extends string>(springs: Record<T, number>, precision: number) {
  const springs$: Record<T, number> = {} as Record<T, number>;

  for (const key of Object.keys(springs)) {
    springs$[key] = fix(springs[key], precision);
  }

  return springs$;
}

function detectAreSpringsDifferent<T extends string>(
  prevSprings: Record<T, number>,
  nextSprings: Record<T, number>,
  precision: number,
) {
  for (const key of Object.keys(nextSprings)) {
    if (fix(prevSprings[key], precision) !== fix(nextSprings[key], precision)) return true;
  }

  return false;
}

export { useMotion };
