import { platform } from '@dark-engine/core';

import { sleep } from '@test-utils';
import { type ConfiguratorFn, Controller } from '../controller';
import { type SpringValue } from '../shared';
import { SharedState } from './state';
import { range } from '../utils';

type SpringProps = 'scale';

jest.spyOn(platform, 'raf').mockImplementation((cb: FrameRequestCallback) => setTimeout(cb, 8));
jest.spyOn(platform, 'caf').mockImplementation((id: number) => clearTimeout(id));

let nextKey = -1;
const genKey = () => ++nextKey;
const time = () => Date.now();

function setup<T extends string>(configurator: ConfiguratorFn<T>, size = 4) {
  const updates: Array<Array<SpringValue<T>>> = [];
  const state = new SharedState();
  const ctrls = range(size).map(() => new Controller<T>(state));

  state.setCtrls(ctrls);
  ctrls.forEach((ctrl, idx) => {
    const { from, to, config } = configurator(idx);
    const left = ctrls[idx - 1] || null;
    const right = ctrls[idx + 1] || null;

    updates[idx] = [];
    ctrl.setIdx(idx);
    ctrl.setKey(genKey());
    ctrl.setFrom(from);
    ctrl.setTo(to);
    ctrl.setSpringConfigFn(config);
    ctrl.setConfigurator(configurator);
    ctrl.setLeft(left);
    ctrl.setRight(right);
    ctrl.setNotifier(x => updates[idx].push(x));
  });

  return {
    state,
    updates,
    ctrls,
  };
}

describe('@animations/state', () => {
  test('has required methods', () => {
    const state = new SharedState();

    expect(state.detectIsRightFlow).toBeDefined();
    expect(state.completeSeries).toBeDefined();
    expect(state.event).toBeDefined();
    expect(state.getCtrls).toBeDefined();
    expect(state.setCtrls).toBeDefined();
    expect(state.getIsCanceled).toBeDefined();
    expect(state.getIsPaused).toBeDefined();
    expect(state.getIsTrail).toBeDefined();
    expect(state.setIsTrail).toBeDefined();
    expect(state.setIsPlaying).toBeDefined();
    expect(state.detectIsPlaying).toBeDefined();
    expect(state.start).toBeDefined();
    expect(state.pause).toBeDefined();
    expect(state.reset).toBeDefined();
    expect(state.resume).toBeDefined();
    expect(state.delay).toBeDefined();
    expect(state.cancel).toBeDefined();
    expect(state.on).toBeDefined();
    expect(state.once).toBeDefined();
  });

  test('runs an animation in sequence correctly', () => {
    jest.useFakeTimers();
    const configurator: ConfiguratorFn<SpringProps> = () => ({
      from: { scale: 0 },
      to: { scale: 1 },
    });
    const { state, updates } = setup<SpringProps>(configurator);

    state.start();
    jest.runAllTimers();

    expect(updates[0]).toEqual(updates[1]);
    expect(updates[1]).toEqual(updates[2]);
    expect(updates[2]).toEqual(updates[3]);
    expect(updates[0][0]).toEqual({ scale: 0.0109 });
    expect(updates[0][10]).toEqual({ scale: 0.3518 });
    expect(updates[0][updates[0].length - 1]).toEqual({ scale: 1 });
  });

  test('runs an animation in trail sequence correctly', () => {
    jest.useFakeTimers();
    const configurator: ConfiguratorFn<SpringProps> = () => ({
      from: { scale: 0 },
      to: { scale: 1 },
      config: () => ({ tension: 2000 }),
    });
    const { state, updates } = setup<SpringProps>(configurator);

    state.setIsTrail(true);
    state.start();
    jest.runAllTimers();

    expect(updates[0]).not.toEqual(updates[1]);
    expect(updates[1]).not.toEqual(updates[2]);
    expect(updates[2]).not.toEqual(updates[3]);
    expect(updates[0][0]).toEqual({ scale: 0.128 });
    expect(updates[1][0]).toEqual({ scale: 0.0164 });
    expect(updates[2][0]).toEqual({ scale: 0.0021 });
    expect(updates[3][0]).toEqual({ scale: 0.0003 });
    expect(updates[0][updates[0].length - 1]).toEqual({ scale: 1 });
    expect(updates[1][updates[1].length - 1]).toEqual({ scale: 1 });
    expect(updates[2][updates[2].length - 1]).toEqual({ scale: 1 });
    expect(updates[3][updates[3].length - 1]).toEqual({ scale: 1 });
  });

  test('can subscribe on events correctly via on method', () => {
    jest.useFakeTimers();
    const configurator: ConfiguratorFn<SpringProps> = () => ({
      from: { scale: 0 },
      to: { scale: 1 },
    });
    const { state } = setup<SpringProps>(configurator);
    const seriesStartSpy = jest.fn();
    const itemStartSpy = jest.fn();
    const itemChangeSpy = jest.fn();
    const itemEndSpy = jest.fn();
    const seriesEndSpy = jest.fn();
    let seriesStartTime = null;
    let itemStartTime = null;
    let itemEndTime = null;
    let seriesEndTime = null;

    state.on('series-start', () => {
      seriesStartTime = time();
      seriesStartSpy();
    });
    state.on('item-start', () => {
      itemStartTime = time();
      itemStartSpy();
    });
    state.on('item-change', itemChangeSpy);
    state.on('item-end', () => {
      itemEndTime = time();
      itemEndSpy();
    });
    state.on('series-end', () => {
      seriesEndTime = time();
      seriesEndSpy();
    });

    state.start();
    jest.runAllTimers();

    expect(seriesStartSpy).toHaveBeenCalledTimes(1);
    expect(itemStartSpy).toHaveBeenCalledTimes(4);
    expect(itemChangeSpy).toHaveBeenCalledTimes(96 * 4);
    expect(itemEndSpy).toHaveBeenCalledTimes(4);
    expect(seriesEndSpy).toHaveBeenCalledTimes(1);
    expect(seriesStartSpy).toHaveBeenCalledTimes(1);
    expect(seriesEndTime).toBeGreaterThan(seriesStartTime);
    expect(itemEndTime).toBeGreaterThan(itemStartTime);
  });

  test('the on method returns an off function', () => {
    jest.useFakeTimers();
    const configurator: ConfiguratorFn<SpringProps> = () => ({
      from: { scale: 0 },
      to: { scale: 1 },
    });
    const { state } = setup<SpringProps>(configurator);
    const seriesStartSpy = jest.fn();
    const itemStartSpy = jest.fn();
    const itemChangeSpy = jest.fn();
    const itemEndSpy = jest.fn();
    const seriesEndSpy = jest.fn();
    const seriesStartOff = state.on('series-start', seriesStartSpy);
    const itemStartOff = state.on('item-start', itemStartSpy);
    const itemChangeOff = state.on('item-change', itemChangeSpy);
    const itemEndOff = state.on('item-end', itemEndSpy);
    const seriesEndOff = state.on('series-end', seriesEndSpy);

    expect(typeof seriesStartOff).toBe('function');
    expect(typeof itemStartOff).toBe('function');
    expect(typeof itemChangeOff).toBe('function');
    expect(typeof itemEndOff).toBe('function');
    expect(typeof seriesEndOff).toBe('function');

    seriesStartOff();
    itemStartOff();
    itemChangeOff();
    itemEndOff();
    seriesEndOff();

    state.start();
    jest.runAllTimers();

    expect(seriesStartSpy).toHaveBeenCalledTimes(0);
    expect(itemStartSpy).toHaveBeenCalledTimes(0);
    expect(itemChangeSpy).toHaveBeenCalledTimes(0);
    expect(itemEndSpy).toHaveBeenCalledTimes(0);
    expect(seriesEndSpy).toHaveBeenCalledTimes(0);
    expect(seriesStartSpy).toHaveBeenCalledTimes(0);
  });

  test('can subscribe on events correctly via once method', () => {
    jest.useFakeTimers();
    const configurator: ConfiguratorFn<SpringProps> = () => ({
      from: { scale: 0 },
      to: { scale: 1 },
    });
    const { state } = setup<SpringProps>(configurator);
    const seriesStartSpy = jest.fn();
    const itemStartSpy = jest.fn();
    const itemChangeSpy = jest.fn();
    const itemEndSpy = jest.fn();
    const seriesEndSpy = jest.fn();
    let seriesStartTime = null;
    let itemStartTime = null;
    let itemEndTime = null;
    let seriesEndTime = null;

    state.once('series-start', () => {
      seriesStartTime = time();
      seriesStartSpy();
    });
    state.once('item-start', () => {
      itemStartTime = time();
      itemStartSpy();
    });
    state.once('item-change', itemChangeSpy);
    state.once('item-end', () => {
      itemEndTime = time();
      itemEndSpy();
    });
    state.once('series-end', () => {
      seriesEndTime = time();
      seriesEndSpy();
    });

    state.start();
    jest.runAllTimers();

    expect(seriesStartSpy).toHaveBeenCalledTimes(1);
    expect(itemStartSpy).toHaveBeenCalledTimes(1);
    expect(itemChangeSpy).toHaveBeenCalledTimes(1);
    expect(itemEndSpy).toHaveBeenCalledTimes(1);
    expect(seriesEndSpy).toHaveBeenCalledTimes(1);
    expect(seriesStartSpy).toHaveBeenCalledTimes(1);
    expect(seriesEndTime).toBeGreaterThan(seriesStartTime);
    expect(itemEndTime).toBeGreaterThan(itemStartTime);
  });

  test('the once method returns an off function', () => {
    jest.useFakeTimers();
    const configurator: ConfiguratorFn<SpringProps> = () => ({
      from: { scale: 0 },
      to: { scale: 1 },
    });
    const { state } = setup<SpringProps>(configurator);
    const seriesStartSpy = jest.fn();
    const itemStartSpy = jest.fn();
    const itemChangeSpy = jest.fn();
    const itemEndSpy = jest.fn();
    const seriesEndSpy = jest.fn();
    const seriesStartOff = state.once('series-start', seriesStartSpy);
    const itemStartOff = state.once('item-start', itemStartSpy);
    const itemChangeOff = state.once('item-change', itemChangeSpy);
    const itemEndOff = state.once('item-end', itemEndSpy);
    const seriesEndOff = state.once('series-end', seriesEndSpy);

    expect(typeof seriesStartOff).toBe('function');
    expect(typeof itemStartOff).toBe('function');
    expect(typeof itemChangeOff).toBe('function');
    expect(typeof itemEndOff).toBe('function');
    expect(typeof seriesEndOff).toBe('function');

    seriesStartOff();
    itemStartOff();
    itemChangeOff();
    itemEndOff();
    seriesEndOff();

    state.start();
    jest.runAllTimers();

    expect(seriesStartSpy).toHaveBeenCalledTimes(0);
    expect(itemStartSpy).toHaveBeenCalledTimes(0);
    expect(itemChangeSpy).toHaveBeenCalledTimes(0);
    expect(itemEndSpy).toHaveBeenCalledTimes(0);
    expect(seriesEndSpy).toHaveBeenCalledTimes(0);
    expect(seriesStartSpy).toHaveBeenCalledTimes(0);
  });

  test('can pause animation correctly', async () => {
    jest.useRealTimers();
    const configurator: ConfiguratorFn<SpringProps> = () => ({
      from: { scale: 0 },
      to: { scale: 1 },
    });
    const { state, updates } = setup<SpringProps>(configurator);

    state.start();
    await sleep(10);
    expect(updates[0].length).toBeGreaterThan(0);
    expect(updates[1].length).toBeGreaterThan(0);
    expect(updates[2].length).toBeGreaterThan(0);
    expect(updates[3].length).toBeGreaterThan(0);

    const length0 = updates[0].length;
    const length1 = updates[1].length;
    const length2 = updates[2].length;
    const length3 = updates[3].length;

    state.pause();
    await sleep(10);
    expect(updates[0].length).toBe(length0);
    expect(updates[1].length).toBe(length1);
    expect(updates[2].length).toBe(length2);
    expect(updates[3].length).toBe(length3);
    await sleep(10);
    expect(updates[0].length).toBe(length0);
    expect(updates[1].length).toBe(length1);
    expect(updates[2].length).toBe(length2);
    expect(updates[3].length).toBe(length3);
  });

  test('can resume animation after pause correctly', async () => {
    jest.useRealTimers();
    const configurator: ConfiguratorFn<SpringProps> = () => ({
      from: { scale: 0 },
      to: { scale: 1 },
    });
    const { state, updates } = setup<SpringProps>(configurator);

    state.start();
    await sleep(10);
    expect(updates[0].length).toBeGreaterThan(0);
    expect(updates[1].length).toBeGreaterThan(0);
    expect(updates[2].length).toBeGreaterThan(0);
    expect(updates[3].length).toBeGreaterThan(0);

    const length0 = updates[0].length;
    const length1 = updates[1].length;
    const length2 = updates[2].length;
    const length3 = updates[3].length;

    state.pause();
    await sleep(10);
    state.resume();
    await sleep(10);
    expect(updates[0].length).toBeGreaterThan(length0);
    expect(updates[1].length).toBeGreaterThan(length1);
    expect(updates[2].length).toBeGreaterThan(length2);
    expect(updates[3].length).toBeGreaterThan(length3);
  });

  test('can delay animation correctly', async () => {
    jest.useRealTimers();
    const configurator: ConfiguratorFn<SpringProps> = () => ({
      from: { scale: 0 },
      to: { scale: 1 },
    });
    const { state, updates } = setup<SpringProps>(configurator);

    state.delay(50);
    state.start();
    await sleep(10);
    expect(updates[0].length).toBe(0);
    expect(updates[1].length).toBe(0);
    expect(updates[2].length).toBe(0);
    expect(updates[3].length).toBe(0);
    await sleep(100);
    expect(updates[0].length).toBeGreaterThan(0);
    expect(updates[1].length).toBeGreaterThan(0);
    expect(updates[2].length).toBeGreaterThan(0);
    expect(updates[3].length).toBeGreaterThan(0);
  });

  test('can delay animation correctly', async () => {
    jest.useRealTimers();
    const configurator: ConfiguratorFn<SpringProps> = () => ({
      from: { scale: 0 },
      to: { scale: 1 },
    });
    const { state, updates } = setup<SpringProps>(configurator);

    state.delay(50);
    state.start();
    await sleep(10);
    expect(updates[0].length).toBe(0);
    expect(updates[1].length).toBe(0);
    expect(updates[2].length).toBe(0);
    expect(updates[3].length).toBe(0);
    await sleep(100);
    expect(updates[0].length).toBeGreaterThan(0);
    expect(updates[1].length).toBeGreaterThan(0);
    expect(updates[2].length).toBeGreaterThan(0);
    expect(updates[3].length).toBeGreaterThan(0);
  });

  test('can reset animation correctly', () => {
    jest.useFakeTimers();
    const configurator: ConfiguratorFn<SpringProps> = () => ({
      from: { scale: 0 },
      to: { scale: 1 },
    });
    const { state, ctrls } = setup<SpringProps>(configurator);

    state.start();
    jest.runAllTimers();

    expect(ctrls[0].getValue()).toEqual({ scale: 1 });
    expect(ctrls[1].getValue()).toEqual({ scale: 1 });
    expect(ctrls[2].getValue()).toEqual({ scale: 1 });
    expect(ctrls[3].getValue()).toEqual({ scale: 1 });
    state.reset();
    expect(ctrls[0].getValue()).toEqual({ scale: 0 });
    expect(ctrls[1].getValue()).toEqual({ scale: 0 });
    expect(ctrls[2].getValue()).toEqual({ scale: 0 });
    expect(ctrls[3].getValue()).toEqual({ scale: 0 });
  });

  test('can cancel animation correctly', async () => {
    jest.useRealTimers();
    const configurator: ConfiguratorFn<SpringProps> = () => ({
      from: { scale: 0 },
      to: { scale: 1 },
    });
    const { state, updates } = setup<SpringProps>(configurator);

    state.delay(10);
    state.start();
    await sleep(50);
    expect(updates[0].length).toBeGreaterThan(0);
    expect(updates[1].length).toBeGreaterThan(0);
    expect(updates[2].length).toBeGreaterThan(0);
    expect(updates[3].length).toBeGreaterThan(0);

    const length0 = updates[0].length;
    const length1 = updates[1].length;
    const length2 = updates[2].length;
    const length3 = updates[3].length;

    state.cancel();
    await sleep(50);
    expect(updates[0].length).toBe(length0);
    expect(updates[1].length).toBe(length1);
    expect(updates[2].length).toBe(length2);
    expect(updates[3].length).toBe(length3);
  });

  test('can detect a playing animation correctly', () => {
    jest.useFakeTimers();
    const configurator: ConfiguratorFn<SpringProps> = () => ({
      from: { scale: 0 },
      to: { scale: 1 },
    });
    const { state, ctrls } = setup<SpringProps>(configurator);

    state.start();
    expect(state.detectIsPlaying()).toBe(true);
    expect(state.detectIsPlaying(ctrls[0].getKey())).toBe(true);
    expect(state.detectIsPlaying(ctrls[1].getKey())).toBe(true);
    expect(state.detectIsPlaying(ctrls[2].getKey())).toBe(true);
    expect(state.detectIsPlaying(ctrls[3].getKey())).toBe(true);
    jest.runAllTimers();
    expect(state.detectIsPlaying()).toBe(false);
    expect(state.detectIsPlaying(ctrls[0].getKey())).toBe(false);
    expect(state.detectIsPlaying(ctrls[1].getKey())).toBe(false);
    expect(state.detectIsPlaying(ctrls[2].getKey())).toBe(false);
    expect(state.detectIsPlaying(ctrls[3].getKey())).toBe(false);
  });
});
