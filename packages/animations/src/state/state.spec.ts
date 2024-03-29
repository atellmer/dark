import { mockBrowserPlatform, getSpyLength, time } from '@test-utils';

import { type ConfiguratorFn, Controller } from '../controller';
import { SharedState } from './state';
import { range } from '../utils';

type SpringProps = 'scale';
let nextKey = -1;
const genKey = () => ++nextKey;

beforeEach(() => {
  jest.useFakeTimers();
  mockBrowserPlatform();
});

function setup<T extends string>(configurator: ConfiguratorFn<T>, size = 4) {
  const state = new SharedState();
  const ctrls = range(size).map(() => new Controller<T>(state));
  const spies: Array<jest.Mock> = [];

  state.setCtrls(ctrls);
  ctrls.forEach((ctrl, idx) => {
    const { from, to, config } = configurator(idx);
    const left = ctrls[idx - 1] || null;
    const right = ctrls[idx + 1] || null;

    spies[idx] = jest.fn();
    ctrl.setIdx(idx);
    ctrl.setKey(genKey());
    ctrl.setFrom(from);
    ctrl.setTo(to);
    ctrl.setSpringConfigFn(config);
    ctrl.setConfigurator(configurator);
    ctrl.setLeft(left);
    ctrl.setRight(right);
    ctrl.getSpring().on(spies[idx]);
  });

  return {
    state,
    ctrls,
    spies,
  };
}

const toValue = <T extends string>(ctrl: Controller<T>) => ctrl.getSpring().value();

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
    expect(state.defer).toBeDefined();
    expect(state.cancel).toBeDefined();
    expect(state.on).toBeDefined();
  });

  test('runs the animation in sequence correctly', () => {
    const configurator: ConfiguratorFn<SpringProps> = () => ({
      from: { scale: 0 },
      to: { scale: 1 },
    });
    const { state, spies } = setup<SpringProps>(configurator);

    state.start();
    jest.runAllTimers();

    spies.forEach((spy, idx) => spies[idx + 1] && expect(spy.mock.calls).toEqual(spies[idx + 1].mock.calls));
    expect(spies[0]).toHaveBeenCalledWith({ scale: 0.0435 });
    expect(spies[0]).toHaveBeenCalledWith({ scale: 0.8044 });
    expect(spies[0]).toHaveBeenLastCalledWith({ scale: 1 });
  });

  test('runs the animation in trail sequence correctly', () => {
    const configurator: ConfiguratorFn<SpringProps> = () => ({
      from: { scale: 0 },
      to: { scale: 1 },
      config: () => ({ tension: 2000 }),
    });
    const { state, spies } = setup<SpringProps>(configurator);

    state.setIsTrail(true);
    state.start();
    jest.runAllTimers();

    spies.forEach((spy, idx) => spies[idx + 1] && expect(spy.mock.calls).not.toEqual(spies[idx + 1].mock.calls));
    expect(spies[0]).toHaveBeenCalledWith({ scale: 0.512 });
    expect(spies[1]).toHaveBeenCalledWith({ scale: 0.2621 });
    expect(spies[2]).toHaveBeenCalledWith({ scale: 0.1342 });
    expect(spies[3]).toHaveBeenCalledWith({ scale: 0.0687 });
    expect(spies[0]).toHaveBeenLastCalledWith({ scale: 1 });
    expect(spies[1]).toHaveBeenLastCalledWith({ scale: 1 });
    expect(spies[2]).toHaveBeenLastCalledWith({ scale: 1 });
    expect(spies[3]).toHaveBeenLastCalledWith({ scale: 1 });
  });

  test('can subscribe on events correctly', () => {
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
    expect(itemChangeSpy).toHaveBeenCalledTimes(51 * 4);
    expect(itemEndSpy).toHaveBeenCalledTimes(4);
    expect(seriesEndSpy).toHaveBeenCalledTimes(1);
    expect(seriesStartSpy).toHaveBeenCalledTimes(1);
    expect(seriesEndTime).toBeGreaterThan(seriesStartTime);
    expect(itemEndTime).toBeGreaterThan(itemStartTime);
  });

  test('the "on" method returns the off function', () => {
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

  test('can pause the animation correctly', () => {
    const configurator: ConfiguratorFn<SpringProps> = () => ({
      from: { scale: 0 },
      to: { scale: 1 },
    });
    const { state, spies } = setup<SpringProps>(configurator);

    state.start();
    jest.advanceTimersByTime(20);
    expect(getSpyLength(spies[0])).toBeGreaterThan(0);
    expect(getSpyLength(spies[1])).toBeGreaterThan(0);
    expect(getSpyLength(spies[2])).toBeGreaterThan(0);
    expect(getSpyLength(spies[3])).toBeGreaterThan(0);

    const length0 = getSpyLength(spies[0]);
    const length1 = getSpyLength(spies[1]);
    const length2 = getSpyLength(spies[2]);
    const length3 = getSpyLength(spies[3]);

    state.pause();
    jest.advanceTimersByTime(20);
    expect(getSpyLength(spies[0])).toBe(length0);
    expect(getSpyLength(spies[1])).toBe(length1);
    expect(getSpyLength(spies[2])).toBe(length2);
    expect(getSpyLength(spies[3])).toBe(length3);
    jest.advanceTimersByTime(20);
    expect(getSpyLength(spies[0])).toBe(length0);
    expect(getSpyLength(spies[1])).toBe(length1);
    expect(getSpyLength(spies[2])).toBe(length2);
    expect(getSpyLength(spies[3])).toBe(length3);
  });

  test('can resume the animation after pause correctly', () => {
    const configurator: ConfiguratorFn<SpringProps> = () => ({
      from: { scale: 0 },
      to: { scale: 1 },
    });
    const { state, spies } = setup<SpringProps>(configurator);

    state.start();
    jest.advanceTimersByTime(20);
    expect(getSpyLength(spies[0])).toBeGreaterThan(0);
    expect(getSpyLength(spies[1])).toBeGreaterThan(0);
    expect(getSpyLength(spies[2])).toBeGreaterThan(0);
    expect(getSpyLength(spies[3])).toBeGreaterThan(0);

    const length0 = getSpyLength(spies[0]);
    const length1 = getSpyLength(spies[1]);
    const length2 = getSpyLength(spies[2]);
    const length3 = getSpyLength(spies[3]);

    state.pause();
    jest.advanceTimersByTime(20);
    state.resume();
    jest.advanceTimersByTime(20);
    expect(getSpyLength(spies[0])).toBeGreaterThan(length0);
    expect(getSpyLength(spies[1])).toBeGreaterThan(length1);
    expect(getSpyLength(spies[2])).toBeGreaterThan(length2);
    expect(getSpyLength(spies[3])).toBeGreaterThan(length3);
  });

  test('can delay the animation correctly', () => {
    const configurator: ConfiguratorFn<SpringProps> = () => ({
      from: { scale: 0 },
      to: { scale: 1 },
    });
    const { state, spies } = setup<SpringProps>(configurator);

    state.delay(50);
    state.start();
    jest.advanceTimersByTime(20);
    expect(getSpyLength(spies[0])).toBe(0);
    expect(getSpyLength(spies[1])).toBe(0);
    expect(getSpyLength(spies[2])).toBe(0);
    expect(getSpyLength(spies[3])).toBe(0);
    jest.advanceTimersByTime(100);
    expect(getSpyLength(spies[0])).toBeGreaterThan(0);
    expect(getSpyLength(spies[1])).toBeGreaterThan(0);
    expect(getSpyLength(spies[2])).toBeGreaterThan(0);
    expect(getSpyLength(spies[3])).toBeGreaterThan(0);
  });

  test('can reset the animation correctly', () => {
    const configurator: ConfiguratorFn<SpringProps> = () => ({
      from: { scale: 0 },
      to: { scale: 1 },
    });
    const { state, ctrls } = setup<SpringProps>(configurator);

    state.start();
    jest.runAllTimers();

    expect(toValue(ctrls[0])).toEqual({ scale: 1 });
    expect(toValue(ctrls[1])).toEqual({ scale: 1 });
    expect(toValue(ctrls[2])).toEqual({ scale: 1 });
    expect(toValue(ctrls[3])).toEqual({ scale: 1 });
    state.reset();
    expect(toValue(ctrls[0])).toEqual({ scale: 0 });
    expect(toValue(ctrls[1])).toEqual({ scale: 0 });
    expect(toValue(ctrls[2])).toEqual({ scale: 0 });
    expect(toValue(ctrls[3])).toEqual({ scale: 0 });
  });

  test('can cancel the animation correctly', () => {
    const configurator: ConfiguratorFn<SpringProps> = () => ({
      from: { scale: 0 },
      to: { scale: 1 },
    });
    const { state, spies } = setup<SpringProps>(configurator);

    state.delay(20);
    state.start();
    jest.advanceTimersByTime(100);
    expect(getSpyLength(spies[0])).toBeGreaterThan(0);
    expect(getSpyLength(spies[1])).toBeGreaterThan(0);
    expect(getSpyLength(spies[2])).toBeGreaterThan(0);
    expect(getSpyLength(spies[3])).toBeGreaterThan(0);

    const length0 = getSpyLength(spies[0]);
    const length1 = getSpyLength(spies[1]);
    const length2 = getSpyLength(spies[2]);
    const length3 = getSpyLength(spies[3]);

    state.cancel();
    jest.advanceTimersByTime(100);
    expect(getSpyLength(spies[0])).toBe(length0);
    expect(getSpyLength(spies[1])).toBe(length1);
    expect(getSpyLength(spies[2])).toBe(length2);
    expect(getSpyLength(spies[3])).toBe(length3);
  });

  test('can detect the playing animation correctly', () => {
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
