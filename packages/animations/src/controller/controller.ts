import { platform } from '@dark-engine/core';

import { type SpringValue, type Config, defaultConfig, fixSprings, detectAreSpringsDiff } from '../shared';
import { stepper } from '../stepper';
import { time } from '../utils';

class MotionController<T extends string> {
  private spring: SpringValue<T>;
  private prevSpring: SpringValue<T> = null;
  private lastTime: number = null;
  private animationId: number = null;
  private results: Record<string, [number, number]> = {};
  private completed: Record<string, boolean> = {};
  private config: Config;
  private to: SpringValue<T>;
  private update: (springs: SpringValue<T>) => void;
  private updatesQueue: Array<SpringValue<T>> = [];

  constructor(spring: SpringValue<T>, update: (springs: SpringValue<T>) => void, config: Partial<Config> = {}) {
    this.spring = { ...spring };
    this.to = { ...spring };
    this.update = update;
    this.setConfig(config);
  }

  public start(to: Partial<SpringValue<T>>) {
    for (const key of Object.keys(to)) {
      this.to[key] = to[key];
    }

    this.play(this.to);
  }

  private play(to: SpringValue<T>) {
    this.updatesQueue.push(to);
    if (this.animationId) return;
    this.motion(to, () => {
      const { prevSpring, spring } = this;
      const { precision } = this.config;

      detectAreSpringsDiff(prevSpring, spring, precision) && this.update(this.getSpring());
    });
  }

  private motion(to: SpringValue<T>, onLoop: () => void) {
    const { spring, results, completed, config } = this;
    const keys = Object.keys(spring);

    this.prevSpring = { ...spring };
    this.lastTime = time();
    this.animationId = platform.raf(() => {
      const currentTime = time();
      let deltaTime = (currentTime - this.lastTime) / 1000;

      if (deltaTime > 0.016) {
        deltaTime = 0.016;
      }

      this.lastTime = currentTime;

      if (this.updatesQueue.length === 0) {
        this.updatesQueue.push(this.to);
      }

      for (const key of keys) {
        if (!results[key]) {
          results[key] = [spring[key], 0];
        }

        let position = results[key][0];
        let velocity = results[key][1];

        for (const update of this.updatesQueue) {
          const destination: number = update[key];

          [position, velocity] = stepper({ position, velocity, destination, config, step: deltaTime });

          results[key] = [position, velocity];
          completed[key] = position === destination;
        }

        spring[key] = position;
      }

      this.updatesQueue = [];
      onLoop();

      if (!this.checkCompleted(keys)) {
        this.motion(to, onLoop);
      } else {
        this.animationId = null;
        this.results = {};
        this.completed = {};
      }
    });
  }

  private checkCompleted(keys: Array<string>) {
    for (const key of keys) {
      if (!this.completed[key]) return false;
    }

    return true;
  }

  public getSpring() {
    return fixSprings(this.spring, this.config.precision);
  }

  public setTo(value: SpringValue<T>) {
    this.to = value;
  }

  public setConfig(config: Partial<Config> = {}) {
    this.config = { ...defaultConfig, ...config };
  }
}

export { MotionController };
