import { platform, type SubscriberWithValue } from '@dark-engine/core';

import { type SpringValue, type Config, defaultConfig } from '../shared';
import { time, fix } from '../utils';
import { stepper } from '../stepper';

const MAX_DELTA_TIME = 10 * (1000 / 60 / 1000);

class SharedState {
  private flow = Flow.RIGHT;
  private isTrail = false;
  private isLoop = false;
  private isReverse = false;

  constructor(isTrail = false) {
    this.isTrail = isTrail;
  }

  setFlow(x: Flow) {
    this.flow = x;
  }

  detectIsRightFlow() {
    return this.flow === Flow.RIGHT;
  }

  setIsTrail(x: boolean) {
    this.isTrail = x;
  }

  getIsTrail() {
    return this.isTrail;
  }

  setIsLoop(x: boolean) {
    this.isLoop = x;
  }

  getIsLoop() {
    return this.isLoop;
  }

  setIsReverse(x: boolean) {
    this.isReverse = x;
  }

  getIsReverse() {
    return this.isReverse;
  }
}

class MotionController<T extends string> {
  private key: string;
  private value: SpringValue<T>;
  private prevValue: SpringValue<T>;
  private dest: SpringValue<T>;
  private from: SpringValue<T>;
  private to: SpringValue<T>;
  private lastTime: number = null;
  private frameId: number = null;
  private results: Record<string, [number, number]> = {};
  private completed: Record<string, boolean> = {};
  private queue: Array<SpringValue<T>> = [];
  private events = new Map<MotionEvent, Set<SubscriberWithValue<SpringValue<T>>>>();
  private configFn: ConfigFn<T>;
  private left: MotionController<T> = null;
  private right: MotionController<T> = null;
  private shared: SharedState = null;
  private isAdded = false;
  private notifier: (x: SpringValue<T>) => void;

  constructor(key: string, shared: SharedState = null) {
    this.key = key;
    this.shared = shared;
  }

  getKey() {
    return this.key;
  }

  setFrom(value: SpringValue<T>) {
    this.from = value;
    this.value = this.value || { ...value };
  }

  setTo(value: SpringValue<T>) {
    this.to = value;
    this.dest = this.dest || { ...(value || this.from) };
  }

  setConfigFn(fn: (key: T) => Partial<Config> = () => ({})) {
    this.configFn = (key: T) => ({ ...defaultConfig, ...fn(key) });
  }

  getLeft() {
    return this.left;
  }

  setLeft(x: MotionController<T>) {
    this.left = x;
  }

  setRight(x: MotionController<T>) {
    this.right = x;
  }

  setNotifier(fn: (x: SpringValue<T>) => void) {
    this.notifier = fn;
  }

  setFlow(x: Flow) {
    this.shared.setFlow(x);
  }

  setIsAdded(x: boolean) {
    this.isAdded = x;
  }

  getIsAdded() {
    return this.isAdded;
  }

  detectIsReachedFrom() {
    return MotionController.detectAreValuesEqual(this.value, this.from, this.configFn);
  }

  subscribe(event: MotionEvent, handler: SubscriberWithValue<SpringValue<T>>) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }

    const subs = this.events.get(event);

    subs.add(handler);

    return () => subs.delete(handler);
  }

  getValue() {
    const value$ = {} as SpringValue<T>;

    for (const key of Object.keys(this.value)) {
      const { precision } = this.configFn(key as T);

      value$[key] = fix(this.value[key], precision);
    }

    return value$;
  }

  start(fn: Updater<T> = () => this.to || this.from) {
    const dest = fn(this.value);

    if (!this.to) {
      this.to = { ...this.from, ...dest };
    }

    Object.assign(this.dest, dest);

    return this.play(this.dest);
  }

  reverse() {
    const dest = this.calculateDest(this.from, false);

    return this.start(() => dest);
  }

  toggle() {
    const dest = !this.prevValue ? this.to : this.calculateDest(this.prevValue, true);

    return this.start(() => dest);
  }

  pause() {
    this.cancel();
    this.frameId = null;
  }

  reset() {
    this.value = { ...this.from };
    this.dest = { ...(this.to || this.from) };
  }

  cancel() {
    this.frameId && platform.caf(this.frameId);
  }

  getConfigFn() {
    return this.configFn;
  }

  private async play(to: SpringValue<T>) {
    this.queue.push(to);
    if (this.frameId) return false;
    this.fireEvent('start');
    const isSuccess = await this.motion(to);

    return isSuccess;
  }

  private calculateDest(target: SpringValue<T>, isToggle: boolean) {
    const key = MotionController.getAvailableKey(target, this.to);

    if (isToggle) {
      if (this.value[key] === this.from[key]) return this.to;
      if (this.value[key] === this.to[key]) return this.from;
    } else {
      if (this.value[key] === this.from[key] || this.value[key] === this.to[key]) return this.from;
    }

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
      const { value, results, completed, configFn } = this;
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

            const config = configFn(key as T);
            let pos = results[key][0];
            let vel = results[key][1];

            for (const update of this.queue) {
              const dest = update[key] as number;

              [pos, vel] = stepper(pos, vel, dest, step, config);
              results[key] = [pos, vel];
              completed[key] = pos === dest;
            }

            value[key] = pos;
          }

          this.queue = [];
          this.loop();

          if (this.checkCompleted(keys)) {
            this.frameId = null;
            this.results = {};
            this.completed = {};
            this.fireEvent('end');
            resolve(true);
          } else {
            this.motion(to).then(resolve).catch(reject);
          }
        } catch (err) {
          reject(err);
        }
      });
    });
  }

  private loop() {
    this.notifier(this.getValue());
    this.fireEvent('change');

    if (this.shared && this.shared.getIsTrail()) {
      if (this.shared.detectIsRightFlow()) {
        this.right && this.right.start(() => this.value);
      } else {
        this.left && this.left.start(() => this.value);
      }
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

  static detectAreValuesEqual<T extends string>(
    value1: SpringValue<T>,
    value2: SpringValue<T>,
    getConfig: ConfigFn<T>,
  ) {
    for (const key of Object.keys(value2)) {
      const { precision } = getConfig(key as T);

      if (fix(value1[key], precision) !== fix(value2[key], precision)) return false;
    }

    return true;
  }

  static getAvailableKey<T extends string>(value: SpringValue<T>, dest: SpringValue<T>) {
    const keys = Object.keys(value);

    for (const key of keys) {
      if (value[key] !== dest[key]) return key;
    }

    return keys[0];
  }
}

export enum Flow {
  RIGHT = 'RIGHT',
  LEFT = 'LEFT',
}

export type Updater<T extends string> = (pv: SpringValue<T>) => Partial<SpringValue<T>>;

export type MotionEvent = 'start' | 'change' | 'end';

export type ConfigFn<T extends string> = (key: T | null) => Config;

export type PartialConfigFn<T extends string> = (key: T | null) => Partial<Config>;

export { SharedState, MotionController };
