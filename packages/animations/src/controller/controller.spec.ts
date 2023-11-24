import { platform } from '@dark-engine/core';

import { type ConfiguratorFn, Controller } from './controller';
import { type SpringValue } from '../shared';
import { SharedState } from '../state';

const idx = 0;

jest.spyOn(platform, 'raf').mockImplementation((cb: FrameRequestCallback) => setTimeout(cb, 8));
jest.spyOn(platform, 'caf').mockImplementation((id: number) => clearTimeout(id));

beforeAll(() => {
  jest.useFakeTimers();
});

afterAll(() => {
  jest.useRealTimers();
});

describe('@animations/controller', () => {
  test('has required methods', () => {
    const ctrl = new Controller(new SharedState());

    expect(ctrl.start).toBeDefined();
    expect(ctrl.cancel).toBeDefined();
    expect(ctrl.reset).toBeDefined();
    expect(ctrl.notify).toBeDefined();
    expect(ctrl.getValue).toBeDefined();
    expect(ctrl.getIdx).toBeDefined();
    expect(ctrl.setIdx).toBeDefined();
    expect(ctrl.getKey).toBeDefined();
    expect(ctrl.setKey).toBeDefined();
    expect(ctrl.getIsReplaced).toBeDefined();
    expect(ctrl.setIsReplaced).toBeDefined();
    expect(ctrl.getItem).toBeDefined();
    expect(ctrl.setItem).toBeDefined();
    expect(ctrl.markAsFake).toBeDefined();
    expect(ctrl.detectIsFake).toBeDefined();
    expect(ctrl.replaceValue).toBeDefined();
    expect(ctrl.setConfigurator).toBeDefined();
    expect(ctrl.setFrom).toBeDefined();
    expect(ctrl.setTo).toBeDefined();
    expect(ctrl.setImmediate).toBeDefined();
    expect(ctrl.setIsPlaying).toBeDefined();
    expect(ctrl.setLeft).toBeDefined();
    expect(ctrl.setRight).toBeDefined();
    expect(ctrl.setSpringConfigFn).toBeDefined();
  });

  test('calls a notifier function correctly', () => {
    type SpringProps = 'scale';
    const ctrl = new Controller<SpringProps>(new SharedState());
    const configurator: ConfiguratorFn<SpringProps> = () => ({
      from: { scale: 0 },
      to: { scale: 2 },
    });
    const { from, to, config } = configurator(idx);
    const spy = jest.fn();

    ctrl.setIdx(idx);
    ctrl.setFrom(from);
    ctrl.setTo(to);
    ctrl.setSpringConfigFn(config);
    ctrl.setConfigurator(configurator);
    ctrl.setNotifier(spy);
    ctrl.start();
    jest.runAllTimers();

    expect(spy).toHaveBeenCalledTimes(105);
  });

  test('can animate a single value', () => {
    type SpringProps = 'x';
    const ctrl = new Controller<SpringProps>(new SharedState());
    const configurator: ConfiguratorFn<SpringProps> = () => ({
      from: { x: 0 },
      to: { x: 100 },
    });
    const { from, to, config } = configurator(idx);
    const updates: Array<SpringValue<SpringProps>> = [];

    ctrl.setIdx(idx);
    ctrl.setFrom(from);
    ctrl.setTo(to);
    ctrl.setSpringConfigFn(config);
    ctrl.setConfigurator(configurator);
    ctrl.setNotifier(x => updates.push(x));
    ctrl.start();
    jest.runAllTimers();

    expect(updates.length).toEqual(154);
    expect(updates[0]).toEqual({ x: 1.088 });
    expect(updates[10]).toEqual({ x: 35.1839 });
    expect(updates[50]).toEqual({ x: 96.5711 });
    expect(updates[150]).toEqual({ x: 99.9988 });
    expect(ctrl.getValue()).toEqual({ x: 100 });
  });

  test('can animate a complex value', () => {
    type SpringProps = 'x' | 'y' | 'x';
    const ctrl = new Controller<SpringProps>(new SharedState());
    const configurator: ConfiguratorFn<SpringProps> = () => ({
      from: { x: -100, y: 0, z: 0 },
      to: { x: 100, y: 200, z: 10 },
    });
    const { from, to, config } = configurator(idx);
    const updates: Array<SpringValue<SpringProps>> = [];

    ctrl.setIdx(idx);
    ctrl.setFrom(from);
    ctrl.setTo(to);
    ctrl.setSpringConfigFn(config);
    ctrl.setConfigurator(configurator);
    ctrl.setNotifier(x => updates.push(x));
    ctrl.start();
    jest.runAllTimers();

    expect(updates.length).toEqual(163);
    expect(updates[0]).toEqual({ x: -97.824, y: 2.176, z: 0.1088 });
    expect(updates[10]).toEqual({ x: -29.6322, y: 70.3678, z: 3.5184 });
    expect(updates[50]).toEqual({ x: 93.1421, y: 193.1421, z: 9.6571 });
    expect(updates[100]).toEqual({ x: 99.8691, y: 199.8691, z: 9.9935 });
    expect(ctrl.getValue()).toEqual({ x: 100, y: 200, z: 10 });
  });

  test('can use a custom config', () => {
    type SpringProps = 'opacity';
    const updates1: Array<SpringValue<SpringProps>> = [];
    const updates2: Array<SpringValue<SpringProps>> = [];
    {
      const ctrl = new Controller<SpringProps>(new SharedState());
      const configurator: ConfiguratorFn<SpringProps> = () => ({
        from: { opacity: 0 },
        to: { opacity: 1 },
      });
      const { from, to, config } = configurator(idx);

      ctrl.setIdx(idx);
      ctrl.setFrom(from);
      ctrl.setTo(to);
      ctrl.setSpringConfigFn(config);
      ctrl.setConfigurator(configurator);
      ctrl.setNotifier(x => updates1.push(x));
      ctrl.start();
    }
    {
      const ctrl = new Controller<SpringProps>(new SharedState());
      const configurator: ConfiguratorFn<SpringProps> = () => ({
        from: { opacity: 0 },
        to: { opacity: 1 },
        config: () => ({ tension: 40 }),
      });
      const { from, to, config } = configurator(idx);

      ctrl.setIdx(idx);
      ctrl.setFrom(from);
      ctrl.setTo(to);
      ctrl.setSpringConfigFn(config);
      ctrl.setConfigurator(configurator);
      ctrl.setNotifier(x => updates2.push(x));
      ctrl.start();
    }

    jest.runAllTimers();

    expect(updates1.length).toEqual(96);
    expect(updates2.length).toEqual(534);
    expect(updates1[updates1.length - 1]).toEqual({ opacity: 1 });
    expect(updates2[updates2.length - 1]).toEqual({ opacity: 1 });
  });

  test('can use a cutom config for different values', () => {
    type SpringProps = 'x' | 'y';
    const ctrl = new Controller<SpringProps>(new SharedState());
    const configurator: ConfiguratorFn<SpringProps> = () => ({
      from: { x: 0, y: 0 },
      to: { x: 100, y: 100 },
      config: key => ({ tension: key === 'y' ? 100 : 200 }),
    });
    const { from, to, config } = configurator(idx);
    const updates: Array<SpringValue<SpringProps>> = [];

    ctrl.setIdx(idx);
    ctrl.setFrom(from);
    ctrl.setTo(to);
    ctrl.setSpringConfigFn(config);
    ctrl.setConfigurator(configurator);
    ctrl.setNotifier(x => updates.push(x));
    ctrl.start();
    jest.runAllTimers();

    expect(updates.length).toEqual(321);
    expect(updates[0]).toEqual({ x: 1.28, y: 0.64 });
    expect(updates[10]).toEqual({ x: 40.6131, y: 21.6316 });
    expect(updates[50]).toEqual({ x: 98.9403, y: 81.2511 });
    expect(updates[100]).toEqual({ x: 100, y: 96.9774 });
    expect(updates[updates.length - 1]).toEqual({ x: 100, y: 100 });
  });

  test('can animate without initial destination value', () => {
    type SpringProps = 'x';
    const ctrl = new Controller<SpringProps>(new SharedState());
    const configurator: ConfiguratorFn<SpringProps> = () => ({
      from: { x: 0 },
    });
    const { from, to, config } = configurator(idx);
    const updates: Array<SpringValue<SpringProps>> = [];

    ctrl.setIdx(idx);
    ctrl.setFrom(from);
    ctrl.setTo(to);
    ctrl.setSpringConfigFn(config);
    ctrl.setConfigurator(configurator);
    ctrl.setNotifier(x => updates.push(x));
    ctrl.start(() => ({ to: { x: 100 } }));
    jest.runAllTimers();

    expect(updates.length).toEqual(154);
    expect(updates[0]).toEqual({ x: 1.088 });
    expect(updates[10]).toEqual({ x: 35.1839 });
    expect(updates[50]).toEqual({ x: 96.5711 });
    expect(updates[150]).toEqual({ x: 99.9988 });
    expect(ctrl.getValue()).toEqual({ x: 100 });
  });

  test('can set an immediate value', () => {
    type SpringProps = 'x' | 'zIndex';
    const ctrl = new Controller<SpringProps>(new SharedState());
    const configurator: ConfiguratorFn<SpringProps> = () => ({
      from: { x: 0, zIndex: 0 },
      to: { x: 100, zIndex: 1 },
      immediate: key => key === 'zIndex',
    });
    const { from, to, config } = configurator(idx);
    let updates: Array<SpringValue<SpringProps>> = [];

    ctrl.setIdx(idx);
    ctrl.setFrom(from);
    ctrl.setTo(to);
    ctrl.setSpringConfigFn(config);
    ctrl.setConfigurator(configurator);
    ctrl.setNotifier(x => updates.push(x));
    ctrl.start();
    jest.runAllTimers();

    expect(updates[0]).toEqual({ x: 1.088, zIndex: 1 });
    expect(updates[updates.length - 1]).toEqual({ x: 100, zIndex: 1 });

    updates = [];
    ctrl.start(() => ({ to: { x: 0, zIndex: 0 } }));
    jest.runAllTimers();

    expect(updates[0]).toEqual({ x: 98.912, zIndex: 1 });
    expect(updates[updates.length - 1]).toEqual({ x: 0, zIndex: 1 });
    expect(ctrl.getValue()).toEqual({ x: 0, zIndex: 0 });
  });

  test('can reset value correctly', () => {
    type SpringProps = 'scale';
    const ctrl = new Controller<SpringProps>(new SharedState());
    const configurator: ConfiguratorFn<SpringProps> = () => ({
      from: { scale: 0 },
      to: { scale: 2 },
    });
    const { from, to, config } = configurator(idx);

    ctrl.setIdx(idx);
    ctrl.setFrom(from);
    ctrl.setTo(to);
    ctrl.setSpringConfigFn(config);
    ctrl.setConfigurator(configurator);
    ctrl.setNotifier(() => {});
    ctrl.start();
    jest.runAllTimers();

    expect(ctrl.getValue()).toEqual({ scale: 2 });

    ctrl.reset();

    expect(ctrl.getValue()).toEqual({ scale: 0 });
  });

  test('can cancel animation', () => {
    type SpringProps = 'scale';
    const ctrl = new Controller<SpringProps>(new SharedState());
    const configurator: ConfiguratorFn<SpringProps> = () => ({
      from: { scale: 0 },
      to: { scale: 2 },
    });
    const { from, to, config } = configurator(idx);

    ctrl.setIdx(idx);
    ctrl.setFrom(from);
    ctrl.setTo(to);
    ctrl.setSpringConfigFn(config);
    ctrl.setConfigurator(configurator);
    ctrl.setNotifier(() => {});
    ctrl.start();
    ctrl.cancel();
    jest.runAllTimers();

    expect(ctrl.getValue()).toEqual({ scale: 0 });
  });
});
