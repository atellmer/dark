import { platform, type SubscriberWithValue } from '@dark-engine/core';

import { type SpringValue, type PhysicConfig, defaultPhysicConfig } from '../shared';
import { time, fix } from '../utils';
import { stepper } from '../stepper';
import { SharedState, Flow } from '../shared-state';

const MAX_DELTA_TIME = 10 * (1000 / 60 / 1000);

type BaseConfig<T extends string> = {
  from: SpringValue<T>;
  to?: SpringValue<T>;
  config?: PartialPhysicConfigurator<T>;
  immediate?: (key: T) => boolean;
};
class Controller<T extends string> {
  private key: string;
  private from: SpringValue<T>;
  private to: SpringValue<T>;
  private value: SpringValue<T>;
  private prevValue: SpringValue<T>;
  private dest: SpringValue<T>;
  private lastTime: number = null;
  private frameId: number = null;
  private results: Record<string, [number, number]> = {};
  private completed: Record<string, boolean> = {};
  private queue: Array<SpringValue<T>> = [];
  private events = new Map<MotionEvent, Set<SubscriberWithValue<SpringValue<T>>>>();
  private physicConf: PhysicConfigurator<T>;
  private left: Controller<T> = null;
  private right: Controller<T> = null;
  private shared: SharedState = null;
  private isPaused = false;
  private isAdded = false;
  private isRemoved = false;
  private notifier: (x: SpringValue<T>) => void;
  private configurator: (idx: number) => BaseConfig<T>;
  private immediate: (key: T) => boolean = () => false;

  constructor(shared: SharedState = null) {
    this.shared = shared;
  }

  getKey() {
    return this.key;
  }

  setKey(x: string) {
    this.key = x;
  }

  setFrom(value: SpringValue<T>) {
    this.from = value;
    this.value = this.value || { ...value };
  }

  setTo(value: SpringValue<T>) {
    this.to = value || { ...this.from }; //!
    this.dest = this.dest || { ...(value || this.from) };
  }

  setPhysicConf(fn: (key: T) => Partial<PhysicConfig> = () => ({})) {
    this.physicConf = (key: T) => ({ ...defaultPhysicConfig, ...fn(key) });
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

  setConfigurator(fn: (idx: number) => BaseConfig<T>) {
    this.configurator = fn;
  }

  setImmediate(fn: (key: T) => boolean) {
    this.immediate = fn || this.immediate;
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
      const config = this.physicConf(key as T);

      value$[key] = fix(this.value[key], config.fix);
    }

    return value$;
  }

  start(fn: Updater<T> = () => this.to || this.from, idx = 0) {
    const { from, to, config, immediate } = this.configurator(idx);

    this.setFrom(from);
    this.setTo(to);
    this.setPhysicConf(config);
    this.setImmediate(immediate);
    Object.assign(this.dest, fn(idx));

    return this.play(this.dest);
  }

  back(idx = 0) {
    const { from, to } = this.configurator(idx);

    this.setFrom(from);
    this.setTo(to);

    const dest = this.calculateDest(this.from, false);

    return this.start(() => dest, idx);
  }

  toggle(idx = 0) {
    const { from, to } = this.configurator(idx);

    this.setFrom(from);
    this.setTo(to);

    const dest = !this.prevValue ? this.to : this.calculateDest(this.prevValue, true);

    return this.start(() => dest, idx);
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
    return Controller.detectAreValuesEqual(this.value, this.from, this.physicConf);
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
      const { value, results, completed, physicConf: configFn } = this;
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

              const config = configFn(key);
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

        right && right.start(() => this.value);
      } else {
        const left = this.getSiblingToChange(false);

        left && left.start(() => this.value);
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

  private fireEvent(event: MotionEvent) {
    this.events.has(event) && this.events.get(event).forEach(x => x(this.value));
  }

  static detectAreValuesEqual<T extends string>(
    value1: SpringValue<T>,
    value2: SpringValue<T>,
    conf: PhysicConfigurator<T>,
  ) {
    for (const key of Object.keys(value2)) {
      const config = conf(key as T);

      if (fix(value1[key], config.fix) !== fix(value2[key], config.fix)) return false;
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

export type Updater<T extends string> = (idx: number) => Partial<SpringValue<T>>;

export type MotionEvent = 'start' | 'change' | 'end';

export type PhysicConfigurator<T extends string> = (key: T | null) => PhysicConfig;

export type PartialPhysicConfigurator<T extends string> = (key: T | null) => Partial<PhysicConfig>;

export { Controller };
