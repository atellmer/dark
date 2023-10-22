import { platform, useMemo, useUpdate } from '@dark-engine/core';

import { type Config } from '../shared';
import { presets } from '../presets';
import { time } from '../utils';

type UseMotionOptions<T extends string> = {
  from: Record<T, number>;
  to: Record<T, number>;
  config?: Partial<Config>;
};

function useMotion<T extends string>(options: UseMotionOptions<T>): [Record<T, number>, Api] {
  const { from, to, config = defaultConfig } = options;
  const update = useUpdate();
  const scope = useMemo<Scope<T>>(
    () => ({
      value: { ...from },
      isForward: null,
      lastTime: null,
      rafId: null,
      results: null,
      completed: null,
      config: { ...defaultConfig, ...config },
    }),
    [],
  );
  const value = scope.value as Record<T, number>;

  const play = (to: Record<T, number>) => {
    const from = scope.value;

    scope.results = {};
    scope.completed = {};

    run({
      from,
      to,
      scope,
      onLoop: update,
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

  return [value, api];
}

type Scope<T extends string> = {
  value: Record<T, number>;
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
  const { value, results: cache, completed, config } = scope;
  const keys = Object.keys(value);

  if (!fromLoop) {
    scope.rafId && platform.caf(scope.rafId);
    scope.lastTime = time();
  }

  scope.rafId = platform.raf(() => {
    const currentTime = time();
    const deltaTime = (currentTime - scope.lastTime) / 1000;

    scope.lastTime = currentTime;

    for (const key of keys) {
      if (!cache[key]) {
        cache[key] = [from[key], 0];
      }

      let position = cache[key][0];
      let velocity = cache[key][1];
      const destination: number = to[key];

      [position, velocity] = stepper({ position, velocity, destination, config, step: deltaTime });

      cache[key] = [position, velocity];

      if (position === destination) {
        completed[key] = true;
      }

      value[key] = position;
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
  precision: 0.01,
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

  if (Math.abs(displacement) < precision) {
    return [destination, 0];
  }

  return [newPosition, newVelocity];
}

export { useMotion };
