import { platform, falseFn, detectIsUndefined } from '@dark-engine/core';

import { type SpringValue, type SpringConfig, type Key, defaultSpringConfig } from '../shared';
import { type AnimationEventName, SharedState } from '../state';
import { Spring } from '../spring';
import { time, fix } from '../utils';
import { stepper } from '../stepper';

const BASE_FRAME_TIME_IN_MS = 1000 / 60;
const MAX_SKIPPED_FRAMES = 10;
const MAX_DELTA_TIME_IN_SEC = MAX_SKIPPED_FRAMES * (BASE_FRAME_TIME_IN_MS / 1000);

class Controller<T extends string, I = unknown> {
  private key: Key;
  private idx: number;
  private from: SpringValue<T>;
  private to: SpringValue<T>;
  private value: SpringValue<T>;
  private dest: SpringValue<T>;
  private state: SharedState = null;
  private frameTime: number;
  private frameId: number;
  private results: Record<string, [number, number]> = {};
  private completed: Record<string, boolean> = {};
  private queue: Array<SpringValue<T>> = [];
  private left: Controller<T> = null;
  private right: Controller<T> = null;
  private springConfigFn: SpringConfigFn<T>;
  private configurator: ConfiguratorFn<T>;
  private immediate: ImmediateFn<T> = falseFn;
  private immediates: Array<() => void> = [];
  private primaryKey: Key;
  private isReplaced = false;
  private item: I = null;
  private spring = new Spring<T>();

  constructor(state: SharedState) {
    this.state = state;
    this.key = String(++Controller.key);
  }

  getKey() {
    return this.key;
  }

  setKey(x: Key) {
    this.key = x;
  }

  getIdx() {
    return this.idx;
  }

  setIdx(x: number) {
    this.idx = x;
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

  setLeft(x: Controller<T>) {
    this.left = x;
  }

  setRight(x: Controller<T>) {
    this.right = x;
  }

  notify() {
    this.springify();
    this.event('item-change');
  }

  setConfigurator(fn: ConfiguratorFn<T>) {
    this.configurator = fn;
  }

  setImmediate(fn: ImmediateFn<T>) {
    this.immediate = fn || this.immediate;
  }

  replaceValue(x: SpringValue<T>) {
    this.value = x;
    this.springify();
  }

  markAsFake(x: Key) {
    this.primaryKey = x;

    return Controller.generateFakeKey(x);
  }

  detectIsFake() {
    return !detectIsUndefined(this.primaryKey);
  }

  getIsReplaced() {
    return this.isReplaced;
  }

  setIsReplaced(x: boolean) {
    this.isReplaced = x;
  }

  getItem() {
    return this.item;
  }

  setItem(x: I) {
    this.item = x;
  }

  getState() {
    return this.state;
  }

  getSpring() {
    return this.springify();
  }

  start(fn?: StartFn<T>) {
    if (this.state.getIsCanceled()) return; // !
    const config1 = this.configurator(this.idx);
    const config2 = fn ? fn(this.idx) : this.configurator(this.idx);
    const from = { ...config1.from, ...config2.from };
    const to = { ...config1.to, ...config2.to };
    const config = config2.config || config1.config;
    const immediate = config2.immediate || config1.immediate;

    this.setFrom(config1.from || from);
    this.setTo(config1.to || to);
    this.setSpringConfigFn(config);
    this.setImmediate(immediate);
    Object.assign(this.dest, to);

    this.play(this.dest);
  }

  reset() {
    this.value = { ...this.from };
    this.dest = { ...(this.to || this.from) };
    this.springify();
  }

  cancel() {
    this.frameId && platform.caf(this.frameId);
    this.frameId = null;
  }

  setIsPlaying(x: boolean) {
    this.state.setIsPlaying(x, this.key);
  }

  private play(to: SpringValue<T>) {
    this.queue.push(to);
    if (this.frameId) return false;
    this.setIsPlaying(true);
    this.event('item-start');
    this.motion(to);
  }

  private motion(to: SpringValue<T>) {
    const { value, results, completed, springConfigFn } = this;
    const keys = Object.keys(value) as Array<T>;
    const make = () => this.motion(to);

    this.frameTime = time();
    this.frameId = platform.raf(() => {
      if (this.state.getIsPaused()) return make();
      let step = (time() - this.frameTime) / 1000;

      if (step > MAX_DELTA_TIME_IN_SEC) {
        step = 0;
      }

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
            this.immediates.push(complete);
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
      this.change();

      if (this.checkCompleted(keys)) {
        this.complete();
      } else {
        make();
      }
    });
  }

  private event(name: AnimationEventName) {
    this.state.event(name, { value: this.value, idx: this.idx, key: this.key });
  }

  private change() {
    this.notify();

    if (this.state.getIsTrail()) {
      if (this.state.detectIsRightFlow()) {
        this.right && this.right.start(() => ({ to: this.value }));
      } else {
        this.left && this.left.start(() => ({ to: this.value }));
      }
    }
  }

  private complete() {
    this.setIsPlaying(false);
    this.frameId = null;
    this.results = {};
    this.completed = {};
    this.immediates.forEach(x => x());
    this.immediates.length > 0 && this.notify();
    this.immediates = [];
    this.event('item-end');
    this.state.completeSeries();
  }

  private checkCompleted(keys: Array<string>) {
    for (const key of keys) {
      if (!this.completed[key]) return false;
    }

    return true;
  }

  private springify() {
    const keys = Object.keys(this.value) as Array<T>;

    for (const key of keys) {
      const config = this.springConfigFn(key);
      const value = fix(this.value[key], config.fix);

      this.spring.setProp(key, value);
    }

    return this.spring;
  }

  private static generateFakeKey(x: Key) {
    return `__${x}:${++Controller.fakeKey}__`;
  }

  private static key = -1;
  private static fakeKey = -1;
}

export type BaseItemConfig<T extends string> = {
  from: SpringValue<T>;
  to?: SpringValue<T>;
  config?: PatialConfigFn<T>;
  immediate?: ImmediateFn<T>;
};

export type StartFnConfig<T extends string> = {
  from?: SpringValue<T>;
  to: Partial<SpringValue<T>>;
} & Omit<BaseItemConfig<T>, 'from' | 'to'>;

export type ConfiguratorFn<T extends string> = (idx: number) => BaseItemConfig<T>;

export type StartFn<T extends string> = (idx: number) => StartFnConfig<T>;

export type SpringConfigFn<T extends string> = (key: T) => SpringConfig;

export type PatialConfigFn<T extends string> = (key: T) => Partial<SpringConfig>;

export type ImmediateFn<T extends string> = (key: T) => boolean;

export type NotifierFn<T extends string> = (x: SpringValue<T>) => void;

export { Controller };
