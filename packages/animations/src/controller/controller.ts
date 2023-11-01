import { platform, type SubscriberWithValue } from '@dark-engine/core';

import { type SpringValue, type Config, defaultConfig } from '../shared';
import { time, illegal, getFirstKey, fix } from '../utils';
import { stepper } from '../stepper';

const MAX_DELTA_TIME = 0.016;

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
  private queue: Array<SpringValue<T>> = [];
  private events = new Map<MotionEvent, Set<SubscriberWithValue<SpringValue<T>>>>();
  private getConfig: GetConfig<T>;
  private update: (springs: SpringValue<T>) => void;

  constructor(
    from: SpringValue<T>,
    to: SpringValue<T> | undefined,
    update: SubscriberWithValue<SpringValue<T>>,
    getConfig: (key: T) => Partial<Config> = () => ({}),
  ) {
    this.from = from;
    this.to = to || null;
    this.value = { ...from };
    this.dest = { ...(to || from) };
    this.update = update;
    this.getConfig = (key: T) => ({ ...defaultConfig, ...getConfig(key) });
  }

  public subscribe(event: MotionEvent, handler: SubscriberWithValue<SpringValue<T>>) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }

    const subs = this.events.get(event);

    subs.add(handler);

    return () => subs.delete(handler);
  }

  public getValue() {
    const value$ = {} as SpringValue<T>;

    for (const key of Object.keys(this.value)) {
      const { precision } = this.getConfig(key as T);

      value$[key] = fix(this.value[key], precision);
    }

    return value$;
  }

  public start(fn: Updater<T>) {
    const dest = fn(this.value);

    Object.assign(this.dest, dest);

    return this.play(this.dest);
  }

  public reverse() {
    const dest = this.calculateDest(this.from);

    return this.start(() => dest);
  }

  public toggle() {
    const dest = !this.prevValue ? this.to : this.calculateDest(this.prevValue);

    return this.start(() => dest);
  }

  public pause() {
    this.cancel();
    this.frameId = null;
  }

  public reset() {
    this.value = { ...this.from };
    this.dest = { ...(this.to || this.from) };
  }

  public cancel() {
    this.frameId && platform.caf(this.frameId);
  }

  private async play(to: SpringValue<T>) {
    this.queue.push(to);
    if (this.frameId) return false;
    this.fireEvent('start');
    const isSuccess = await this.motion(to);

    return isSuccess;
  }

  private calculateDest(target: SpringValue<T>) {
    if (!this.to) return illegal(`The destination value not found!`);
    const key = getFirstKey(this.to);
    const isFirstStrategy = this.to[key] > this.from[key];
    const max = isFirstStrategy ? this.to[key] : this.from[key];
    const min = isFirstStrategy ? this.from[key] : this.to[key];
    const isValueOverMax = this.value[key] > max;
    const isValueUnderMin = this.value[key] < min;
    const isTargetOverMax = target[key] > max;
    const isTargetUnderMin = target[key] < min;
    const isGreater = this.value[key] > target[key];
    const dest = isFirstStrategy
      ? isValueOverMax || isTargetOverMax
        ? this.from
        : isValueUnderMin || isTargetUnderMin
        ? this.to
        : isGreater
        ? this.from
        : this.to
      : isValueOverMax || isTargetOverMax
      ? this.to
      : isValueUnderMin || isTargetUnderMin
      ? this.from
      : isGreater
      ? this.to
      : this.from;

    return dest;
  }

  private motion(to: SpringValue<T>) {
    return new Promise<boolean>((resolve, reject) => {
      const { value, results, completed, getConfig } = this;
      const keys = Object.keys(value);

      this.lastTime = time();
      this.frameId = platform.raf(() => {
        try {
          const currentTime = time();
          let step = (currentTime - this.lastTime) / 1000;

          if (step > MAX_DELTA_TIME) {
            step = 0;
          }

          this.prevValue = { ...value };
          this.lastTime = currentTime;

          if (this.queue.length === 0) {
            this.queue.push(this.dest);
          }

          for (const key of keys) {
            if (!results[key]) {
              results[key] = [value[key], 0];
            }

            const config = getConfig(key as T);
            let position = results[key][0];
            let velocity = results[key][1];

            for (const update of this.queue) {
              const dest = update[key] as number;

              [position, velocity] = stepper({ position, velocity, dest, config, step });
              results[key] = [position, velocity];
              completed[key] = position === dest;
            }

            value[key] = position;
          }

          this.queue = [];
          this.loop();

          if (!this.checkCompleted(keys)) {
            this.motion(to).then(resolve).catch(reject);
          } else {
            this.frameId = null;
            this.results = {};
            this.completed = {};
            this.fireEvent('end');
            resolve(true);
          }
        } catch (err) {
          reject(err);
        }
      });
    });
  }

  private loop() {
    const { prevValue, value } = this;
    const isDiff = MotionController.detectAreValuesDiff(prevValue, value, this.getConfig);

    if (isDiff) {
      this.update(this.getValue());
      this.fireEvent('change');
    }
  }

  private checkCompleted(keys: Array<string>) {
    for (const key of keys) {
      if (!this.completed[key]) return false;
    }

    return true;
  }

  private fireEvent(event: MotionEvent) {
    this.events.has(event) && this.events.get(event).forEach(x => x(this.value));
  }

  private static detectAreValuesDiff<T extends string>(
    prevValue: SpringValue<T>,
    nextValue: SpringValue<T>,
    getConfig: GetConfig<T>,
  ) {
    for (const key of Object.keys(nextValue)) {
      const { precision } = getConfig(key as T);

      if (fix(prevValue[key], precision) !== fix(nextValue[key], precision)) return true;
    }

    return false;
  }
}

export type Updater<T extends string> = (pv: SpringValue<T>) => Partial<SpringValue<T>>;

export type MotionEvent = 'start' | 'change' | 'end';

export type GetConfig<T extends string> = (key: T | null) => Config;

export type GetPartialConfig<T extends string> = (key: T | null) => Partial<Config>;

export { MotionController };
