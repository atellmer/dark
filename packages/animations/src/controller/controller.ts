import { platform, type SubscriberWithValue } from '@dark-engine/core';

import { type SpringValue, type Config, defaultConfig, fixValue, detectAreValuesDiff } from '../shared';
import { stepper } from '../stepper';
import { time, illegal, getFirstKey } from '../utils';

const MAX_DELTA_TIME = 0.016;

export type Updater<T extends string> = (pv: SpringValue<T>) => Partial<SpringValue<T>>;

export type MotionEvent = 'start' | 'change' | 'end';

export type EventValue<T extends string> = { value: SpringValue<T>; fromReverse: boolean };

class MotionController<T extends string> {
  private value: SpringValue<T>;
  private prevValue: SpringValue<T> = null;
  private dest: SpringValue<T>;
  private from: SpringValue<T> = null;
  private to: SpringValue<T> = null;
  private lastTime: number = null;
  private frameId: number = null;
  private results: Record<string, [number, number]> = {};
  private completed: Record<string, boolean> = {};
  private config: Config;
  private queue: Array<SpringValue<T>> = [];
  private events = new Map<MotionEvent, Set<SubscriberWithValue<EventValue<T>>>>();
  private update: (springs: SpringValue<T>) => void;

  constructor(
    from: SpringValue<T>,
    to: SpringValue<T> | undefined,
    update: SubscriberWithValue<SpringValue<T>>,
    config: Partial<Config> = {},
  ) {
    this.from = from;
    this.to = to || null;
    this.value = { ...from };
    this.dest = { ...(to || from) };
    this.update = update;
    this.setConfig(config);
  }

  public reset() {
    this.value = { ...this.from };
    this.dest = { ...(this.to || this.from) };
  }

  public subscribe(event: MotionEvent, handler: SubscriberWithValue<EventValue<T>>) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }

    const subs = this.events.get(event);

    subs.add(handler);

    return () => subs.delete(handler);
  }

  private fireEvent(event: MotionEvent, fromReverse: boolean) {
    this.events.has(event) && this.events.get(event).forEach(x => x({ value: this.value, fromReverse }));
  }

  public getValue() {
    return fixValue(this.value, this.config.precision);
  }

  public setConfig(config: Partial<Config> = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  public start(fn: Updater<T>, fromReverse = false) {
    const dest = fn(this.value);

    Object.assign(this.dest, dest);
    this.play(this.dest, fromReverse);
  }

  public reverse() {
    if (!this.to) return illegal(`The destination value not found!`);
    const key = getFirstKey(this.to);
    const isFirstStrategy = this.to[key] > this.from[key];
    const isValueGreater = this.value[key] > this.from[key];
    const dest = isFirstStrategy ? (isValueGreater ? this.from : this.to) : isValueGreater ? this.to : this.from;

    this.start(() => dest, true);
  }

  public pause() {
    this.cancel();
    this.frameId = null;
  }

  public cancel() {
    this.frameId && platform.caf(this.frameId);
  }

  private play(to: SpringValue<T>, fromReverse: boolean) {
    this.queue.push(to);
    if (this.frameId) return;
    this.fireEvent('start', fromReverse);
    this.motion(to, fromReverse, () => {
      const { prevValue, value } = this;
      const { precision } = this.config;
      const isDiff = detectAreValuesDiff(prevValue, value, precision);

      if (isDiff) {
        this.update(this.getValue());
        this.fireEvent('change', fromReverse);
      }
    });
  }

  private motion(to: SpringValue<T>, fromReverse: boolean, onLoop: () => void) {
    const { value, results, completed, config } = this;
    const keys = Object.keys(value);

    this.prevValue = { ...value };
    this.lastTime = time();
    this.frameId = platform.raf(() => {
      const currentTime = time();
      let deltaTime = (currentTime - this.lastTime) / 1000;

      if (deltaTime > MAX_DELTA_TIME) {
        deltaTime = 0;
      }

      this.lastTime = currentTime;

      if (this.queue.length === 0) {
        this.queue.push(this.dest);
      }

      for (const key of keys) {
        if (!results[key]) {
          results[key] = [value[key], 0];
        }

        let position = results[key][0];
        let velocity = results[key][1];

        for (const update of this.queue) {
          const dest = update[key] as number;

          [position, velocity] = stepper({ position, velocity, destination: dest, config, step: deltaTime });
          results[key] = [position, velocity];
          completed[key] = position === dest;
        }

        value[key] = position;
      }

      this.queue = [];
      onLoop();

      if (!this.checkCompleted(keys)) {
        this.motion(to, fromReverse, onLoop);
      } else {
        this.frameId = null;
        this.results = {};
        this.completed = {};
        this.fireEvent('end', fromReverse);
      }
    });
  }

  private checkCompleted(keys: Array<string>) {
    for (const key of keys) {
      if (!this.completed[key]) return false;
    }

    return true;
  }
}

export { MotionController };
