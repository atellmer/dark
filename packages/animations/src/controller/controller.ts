import { platform } from '@dark-engine/core';

import { type SpringValue, type Config, defaultConfig, fixSprings, detectAreSpringsDiff } from '../shared';
import { stepper } from '../stepper';
import { time } from '../utils';

class MotionController<T extends string> {
  private spring: SpringValue<T>;
  private prevSpring: SpringValue<T> = null;
  private isForward: boolean | null = null;
  private lastTime: number = null;
  private rafId: number = null;
  private results: Record<string, [number, number]> = null;
  private completed: Record<string, boolean> = null;
  private config: Config;
  private to: SpringValue<T>;
  private from: SpringValue<T>;
  private update: (springs: SpringValue<T>) => void;

  constructor(springs: SpringValue<T>, update: (springs: SpringValue<T>) => void, config: Partial<Config> = {}) {
    this.spring = { ...springs };
    this.update = update;
    this.setConfig(config);
  }

  public getSpring() {
    return fixSprings(this.spring, this.config.precision);
  }

  public setParams(from: SpringValue<T>, to: SpringValue<T>, config: Partial<Config> = {}) {
    this.setFrom(from);
    this.setTo(to);
    this.setConfig(config);
  }

  public setFrom(value: SpringValue<T>) {
    this.from = value;
  }

  public setTo(value: SpringValue<T>) {
    this.to = value;
  }

  public setConfig(config: Partial<Config> = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  public start() {
    this.isForward = true;
    this.play(this.to);
  }

  public reverse() {
    this.isForward = false;
    this.play(this.from);
  }

  public toggle() {
    const { isForward } = this;

    this.isForward = !isForward;
    this.play(isForward === null ? this.to : isForward ? this.from : this.to);
  }

  public pause() {
    this.rafId && platform.caf(this.rafId);
  }

  public resume() {
    this.play(this.isForward ? this.to : this.from);
  }

  private play(to: SpringValue<T>) {
    const from = this.spring;

    this.results = {};
    this.completed = {};

    this.run(from, to, () => {
      const { prevSpring, spring } = this;
      const { precision } = this.config;

      detectAreSpringsDiff(prevSpring, spring, precision) && this.update(this.getSpring());
    });
  }

  private run<T extends string>(from: SpringValue<T>, to: SpringValue<T>, onLoop: () => void, fromLoop = false) {
    const { spring, results, completed, config } = this;
    const keys = Object.keys(spring);

    this.prevSpring = { ...spring };

    if (!fromLoop) {
      this.rafId && platform.caf(this.rafId);
      this.lastTime = time();
    }

    this.rafId = platform.raf(() => {
      const currentTime = time();
      const deltaTime = (currentTime - this.lastTime) / 1000;

      this.lastTime = currentTime;

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

        spring[key] = position;
      }

      onLoop();

      if (Object.keys(completed).length !== keys.length) {
        this.run(from, to, onLoop, true);
      }
    });
  }
}

export { MotionController };
