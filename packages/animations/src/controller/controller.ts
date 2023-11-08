import { type SubscriberWithValue, platform, falseFn } from '@dark-engine/core';

import { type SpringValue, type SpringConfig, defaultSpringConfig } from '../shared';
import { time, fix } from '../utils';
import { stepper } from '../stepper';
import { SharedState, Flow } from '../shared-state';

const MAX_DELTA_TIME = 10 * (1000 / 60 / 1000);

class Controller<T extends string> {
  private key: string;
  private idx: number;
  private from: SpringValue<T>;
  private to: SpringValue<T>;
  private value: SpringValue<T>;
  private prevValue: SpringValue<T>;
  private dest: SpringValue<T>;
  private state: SharedState = null;
  private frameTime: number;
  private frameId: number;
  private results: Record<string, [number, number]> = {};
  private completed: Record<string, boolean> = {};
  private queue: Array<SpringValue<T>> = [];
  private events = new Map<AnimationEventName, Set<SubscriberWithValue<SpringValue<T>>>>();
  private left: Controller<T> = null;
  private right: Controller<T> = null;
  private springConfigFn: SpringConfigFn<T>;
  private configurator: ConfiguratorFn<T>;
  private notifier: NotifierFn<T>;
  private immediate: ImmediateFn<T> = falseFn;
  private immediates: Array<() => void> = [];

  constructor(state: SharedState) {
    this.state = state;
    this.key = String(++Controller.id);
  }

  getKey() {
    return this.key;
  }

  setKey(x: string) {
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

  setFlow(x: Flow) {
    this.state.setFlow(x);
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

  subscribe(event: AnimationEventName, handler: SubscriberWithValue<SpringValue<T>>) {
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

  start(fn?: StartFn<T>) {
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

  back() {
    const { from, to } = this.configurator(this.idx);

    this.setFrom(from);
    this.setTo(to);

    const dest = this.calculateDest(this.from, false);

    this.start(() => ({ to: dest }));
  }

  toggle() {
    const { from, to } = this.configurator(this.idx);

    this.setFrom(from);
    this.setTo(to);

    const dest = !this.prevValue ? this.to : this.calculateDest(this.prevValue, true);

    this.start(() => ({ to: dest }));
  }

  reset() {
    this.value = { ...this.from };
    this.dest = { ...(this.to || this.from) };
  }

  cancel() {
    this.frameId && platform.caf(this.frameId);
    this.frameId = null;
    this.state.resume();
  }

  detectIsReachedFrom() {
    return detectAreValuesEqual(this.value, this.from, this.springConfigFn);
  }

  detectIsReachedTo() {
    return detectAreValuesEqual(this.value, this.to, this.springConfigFn);
  }

  getAnimationStatus() {
    return {
      isPlaying: !this.state.getIsSeriesCompleted(),
    };
  }

  getIsTrail() {
    return this.state.getIsTrail();
  }

  setIsPlaying(x: boolean) {
    this.state.setIsPlaying(x, this.key);
  }

  private calculateDest(target: SpringValue<T>, isToggle: boolean) {
    const key = getAvailableKey(target, this.to);

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

  private play(to: SpringValue<T>) {
    this.queue.push(to);
    if (this.frameId) return false;
    this.setIsPlaying(true);
    this.event('start');
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

  private change() {
    this.notifier(this.getValue());
    this.event('change');

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
    const isSeriesCompleted = this.state.getIsSeriesCompleted();
    const isReachedTo = this.detectIsReachedTo();
    const isReachedFrom = this.detectIsReachedFrom();
    const isLoop = this.state.getIsLoop();
    const withReset = false; // TODO

    this.frameId = null;
    this.results = {};
    this.completed = {};
    this.immediates.forEach(x => x());
    this.immediates = [];
    this.event('end');

    if (isSeriesCompleted) {
      if (isReachedTo) {
        if (isLoop) {
          if (withReset) {
            const ctrls = this.state.getCtrls();
            const [ctrl] = ctrls;

            ctrls.forEach(x => x.reset());
            ctrl.setFlow(Flow.RIGHT);
            ctrl.start();
          } else {
            this.setFlow(Flow.LEFT);
            this.back();
          }
        }
      } else if (isReachedFrom) {
        if (isLoop) {
          this.setFlow(Flow.RIGHT);
          this.start();
        }
      }
    }
  }

  private checkCompleted(keys: Array<string>) {
    for (const key of keys) {
      if (!this.completed[key]) return false;
    }

    return true;
  }

  private event(name: AnimationEventName) {
    this.events.has(name) && this.events.get(name).forEach(x => x(this.value));
  }

  private static id = -1;
}

function detectAreValuesEqual<T extends string>(
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

function getAvailableKey<T extends string>(value: SpringValue<T>, dest: SpringValue<T>) {
  const keys = Object.keys(value) as Array<T>;

  for (const key of keys) {
    if (value[key] !== dest[key]) return key;
  }

  return keys[0];
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

export type AnimationEventName = 'start' | 'change' | 'end';

export { Controller };
