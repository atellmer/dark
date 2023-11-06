import { type SubscriberWithValue, platform, falseFn } from '@dark-engine/core';

import { type SpringValue, type SpringConfig, defaultSpringConfig } from '../shared';
import { time, fix } from '../utils';
import { stepper } from '../stepper';
import { SharedState, Flow } from '../shared-state';

const MAX_DELTA_TIME = 10 * (1000 / 60 / 1000);

class Controller<T extends string> {
  private key: string;
  private from: SpringValue<T>;
  private to: SpringValue<T>;
  private value: SpringValue<T>;
  private prevValue: SpringValue<T>;
  private dest: SpringValue<T>;
  private lastTime: number;
  private frameId: number;
  private results: Record<string, [number, number]> = {};
  private completed: Record<string, boolean> = {};
  private queue: Array<SpringValue<T>> = [];
  private events = new Map<AnimationEvent, Set<SubscriberWithValue<SpringValue<T>>>>();
  private left: Controller<T> = null;
  private right: Controller<T> = null;
  private shared: SharedState = null;
  private isPaused = false;
  private isAdded = false;
  private isRemoved = false;
  private springConfigFn: SpringConfigFn<T>;
  private configurator: ConfiguratorFn<T>;
  private notifier: NotifierFn<T>;
  private immediate: ImmediateFn<T> = falseFn;

  constructor(shared: SharedState = null) {
    this.shared = shared;
  }

  getKey() {
    return this.key;
  }

  setKey(x: string) {
    this.key = x;
  }

  setFrom(x: SpringValue<T>) {
    this.from = x;
    this.value = this.value || { ...x };
  }

  setTo(x: SpringValue<T>) {
    this.to = x || { ...this.from };
    this.dest = this.dest || { ...(x || this.from) };
  }

  setSpringConfigFn(fn?: PatialConfigFn<T>) {
    this.springConfigFn = fn ? (key: T) => ({ ...defaultSpringConfig, ...fn(key) }) : () => defaultSpringConfig;
  }

  getLeft() {
    return this.left;
  }

  setLeft(x: Controller<T>) {
    this.left = x;
  }

  getRight() {
    return this.right;
  }

  setRight(x: Controller<T>) {
    this.right = x;
  }

  markAsAdded(x: boolean) {
    this.isAdded = x;
  }

  getIsAdded() {
    return this.isAdded;
  }

  markAsRemoved(x: boolean) {
    this.isRemoved = x;
  }

  getIsRemoved() {
    return this.isRemoved;
  }

  setFlow(x: Flow) {
    this.shared.setFlow(x);
  }

  setNotifier(fn: (x: SpringValue<T>) => void) {
    this.notifier = fn;
  }

  setConfigurator(fn: ConfiguratorFn<T>) {
    this.configurator = fn;
  }

  setImmediate(fn: ImmediateFn<T>) {
    this.immediate = fn || this.immediate;
  }

  subscribe(event: AnimationEvent, handler: SubscriberWithValue<SpringValue<T>>) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }

    const subs = this.events.get(event);

    subs.add(handler);

    return () => subs.delete(handler);
  }

  getValue() {
    const fixed = {} as SpringValue<T>;
    const keys = Object.keys(this.value) as Array<T>;

    for (const key of keys) {
      const config = this.springConfigFn(key);

      fixed[key] = fix(this.value[key], config.fix);
    }

    return fixed;
  }

  start(fn?: StartFn<T>, idx = 0) {
    const config1 = this.configurator(idx);
    const config2 = fn ? fn(idx) : this.configurator(idx);
    const from = { ...config1.from, ...config2.from };
    const to = { ...config1.to, ...config2.to };
    const config = config2.config || config1.config;
    const immediate = config2.immediate || config1.immediate;

    this.setFrom(from);
    this.setTo(to);
    this.setSpringConfigFn(config);
    this.setImmediate(immediate);
    Object.assign(this.dest, to);

    return this.play(this.dest);
  }

  back(idx = 0) {
    const { from, to } = this.configurator(idx);

    this.setFrom(from);
    this.setTo(to);

    const dest = this.calculateDest(this.from, false);

    return this.start(() => ({ to: dest }), idx);
  }

  toggle(idx = 0) {
    const { from, to } = this.configurator(idx);

    this.setFrom(from);
    this.setTo(to);

    const dest = !this.prevValue ? this.to : this.calculateDest(this.prevValue, true);

    return this.start(() => ({ to: dest }), idx);
  }

  pause() {
    this.isPaused = true;
  }

  resume() {
    this.isPaused = false;
  }

  reset() {
    this.value = { ...this.from };
    this.dest = { ...(this.to || this.from) };
    this.resume();
  }

  cancel() {
    this.frameId && platform.caf(this.frameId);
    this.frameId = null;
    this.resume();
  }

  detectIsReachedFrom() {
    return Controller.detectAreValuesEqual(this.value, this.from, this.springConfigFn);
  }

  private calculateDest(target: SpringValue<T>, isToggle: boolean) {
    const key = Controller.getAvailableKey(target, this.to);

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

  private async play(to: SpringValue<T>) {
    this.queue.push(to);
    if (this.frameId) return false;
    this.fireEvent('start');
    const isSuccess = await this.motion(to);

    return isSuccess;
  }

  private motion(to: SpringValue<T>, immediates: Array<() => void> = []) {
    return new Promise<boolean>((resolve, reject) => {
      const { value, results, completed, springConfigFn } = this;
      const keys = Object.keys(value) as Array<T>;
      const make = () => this.motion(to, immediates).then(resolve).catch(reject);

      this.lastTime = time();
      this.frameId = platform.raf(() => {
        if (this.isPaused) return make();
        try {
          let step = (time() - this.lastTime) / 1000;

          if (step > MAX_DELTA_TIME) {
            step = 0;
          }

          this.prevValue = { ...value };

          if (this.queue.length === 0) {
            this.queue.push(this.dest);
          }

          for (const key of keys) {
            if (this.immediate(key)) {
              completed[key] = true;

              const complete = () => {
                value[key] = to[key];
                results[key] = [to[key], 0];
              };

              if (to[key] === this.from[key]) {
                immediates.push(complete);
              } else {
                complete();
              }
            } else {
              if (!results[key]) {
                results[key] = [value[key], 0];
              }

              const config = springConfigFn(key);
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
          }

          this.queue = [];
          this.loop();

          if (this.checkCompleted(keys)) {
            this.frameId = null;
            this.results = {};
            this.completed = {};
            immediates.forEach(x => x());
            this.fireEvent('end');
            resolve(true);
          } else {
            make();
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

    if (this.shared && this.shared.getIsTrail() && !this.getIsRemoved()) {
      if (this.shared.detectIsRightFlow()) {
        const right = this.getSiblingToChange(true);

        right && right.start(() => ({ to: this.value }));
      } else {
        const left = this.getSiblingToChange(false);

        left && left.start(() => ({ to: this.value }));
      }
    }
  }

  private getSiblingToChange(isRight: boolean) {
    let controller = isRight ? this.right : this.left;

    if (!controller) return null;

    do {
      if (!controller.getIsRemoved()) return controller;
      controller = isRight ? controller.getRight() : controller.getLeft();
    } while (controller);

    return null;
  }

  private checkCompleted(keys: Array<string>) {
    for (const key of keys) {
      if (!this.completed[key]) return false;
    }

    return true;
  }

  private fireEvent(event: AnimationEvent) {
    this.events.has(event) && this.events.get(event).forEach(x => x(this.value));
  }

  static detectAreValuesEqual<T extends string>(
    value1: SpringValue<T>,
    value2: SpringValue<T>,
    springConfigFn: SpringConfigFn<T>,
  ) {
    const keys = Object.keys(value2) as Array<T>;

    for (const key of keys) {
      const config = springConfigFn(key as T);

      if (fix(value1[key], config.fix) !== fix(value2[key], config.fix)) return false;
    }

    return true;
  }

  static getAvailableKey<T extends string>(value: SpringValue<T>, dest: SpringValue<T>) {
    const keys = Object.keys(value) as Array<T>;

    for (const key of keys) {
      if (value[key] !== dest[key]) return key;
    }

    return keys[0];
  }
}

export type BaseOptions<T extends string> = {
  from: SpringValue<T>;
  to?: SpringValue<T>;
  config?: PatialConfigFn<T>;
  immediate?: ImmediateFn<T>;
};

export type StartOptions<T extends string> = {
  from?: SpringValue<T>;
  to: Partial<SpringValue<T>>;
} & Omit<BaseOptions<T>, 'from' | 'to'>;

export type ConfiguratorFn<T extends string> = (idx: number) => BaseOptions<T>;

export type StartFn<T extends string> = (idx: number) => StartOptions<T>;

export type SpringConfigFn<T extends string> = (key: T) => SpringConfig;

export type PatialConfigFn<T extends string> = (key: T) => Partial<SpringConfig>;

export type ImmediateFn<T extends string> = (key: T) => boolean;

export type NotifierFn<T extends string> = (x: SpringValue<T>) => void;

export type AnimationEvent = 'start' | 'change' | 'end';

export { Controller };
