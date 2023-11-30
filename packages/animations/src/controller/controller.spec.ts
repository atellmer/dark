import { mockPlatformRaf } from '@test-utils';

import { type ConfiguratorFn, Controller } from './controller';
import { SharedState } from '../state';

const idx = 0;
const setup = <T extends string>() => new Controller<T>(new SharedState());

beforeEach(() => {
  jest.useFakeTimers();
  mockPlatformRaf();
});

describe('[@animations/controller]', () => {
  test('has required methods', () => {
    const ctrl = setup();

    expect(ctrl.start).toBeDefined();
    expect(ctrl.cancel).toBeDefined();
    expect(ctrl.reset).toBeDefined();
    expect(ctrl.notify).toBeDefined();
    expect(ctrl.getState).toBeDefined();
    expect(ctrl.getSpring).toBeDefined();
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

  test('calls the notifier function correctly', () => {
    type SpringProps = 'scale';
    const ctrl = setup<SpringProps>();
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
    ctrl.getSpring().on(spy);
    ctrl.start();
    jest.runAllTimers();

    expect(spy).toHaveBeenCalledTimes(56);
  });

  test('can animate the single value', () => {
    type SpringProps = 'x';
    const ctrl = setup<SpringProps>();
    const configurator: ConfiguratorFn<SpringProps> = () => ({
      from: { x: 0 },
      to: { x: 100 },
    });
    const { from, to, config } = configurator(idx);
    const spy = jest.fn();

    ctrl.setIdx(idx);
    ctrl.setFrom(from);
    ctrl.setTo(to);
    ctrl.setSpringConfigFn(config);
    ctrl.setConfigurator(configurator);
    ctrl.getSpring().on(spy);
    ctrl.start();
    jest.runAllTimers();

    expect(spy).toHaveBeenCalledTimes(84);
    expect(spy).toHaveBeenCalledWith({ x: 4.352 });
    expect(spy).toHaveBeenCalledWith({ x: 70.2667 });
    expect(spy).toHaveBeenCalledWith({ x: 99.9639 });
    expect(spy).toHaveBeenLastCalledWith({ x: 100 });
  });

  test('can animate the complex value', () => {
    type SpringProps = 'x' | 'y' | 'x';
    const ctrl = setup<SpringProps>();
    const configurator: ConfiguratorFn<SpringProps> = () => ({
      from: { x: -100, y: 0, z: 0 },
      to: { x: 100, y: 200, z: 10 },
    });
    const { from, to, config } = configurator(idx);
    const spy = jest.fn();

    ctrl.setIdx(idx);
    ctrl.setFrom(from);
    ctrl.setTo(to);
    ctrl.setSpringConfigFn(config);
    ctrl.setConfigurator(configurator);
    ctrl.getSpring().on(spy);
    ctrl.start();
    jest.runAllTimers();

    expect(spy).toHaveBeenCalledTimes(88);
    expect(spy).toHaveBeenCalledWith({ x: -91.296, y: 8.704, z: 0.4352 });
    expect(spy).toHaveBeenCalledWith({ x: 90.5842, y: 190.5842, z: 9.5292 });
    expect(spy).toHaveBeenCalledWith({ x: 99.6508, y: 199.6508, z: 9.9825 });
    expect(spy).toHaveBeenLastCalledWith({ x: 100, y: 200, z: 10 });
  });

  test('can use the custom config', () => {
    type SpringProps = 'opacity';
    const spy1 = jest.fn();
    const spy2 = jest.fn();
    {
      const ctrl = setup<SpringProps>();
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
      ctrl.getSpring().on(spy1);
      ctrl.start();
    }
    {
      const ctrl = setup<SpringProps>();
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
      ctrl.getSpring().on(spy2);
      ctrl.start();
    }

    jest.runAllTimers();

    expect(spy1).toHaveBeenCalledTimes(51);
    expect(spy2).toHaveBeenCalledTimes(269);
    expect(spy1).toHaveBeenLastCalledWith({ opacity: 1 });
    expect(spy2).toHaveBeenLastCalledWith({ opacity: 1 });
  });

  test('can use the cutom config for different values', () => {
    type SpringProps = 'x' | 'y';
    const ctrl = setup<SpringProps>();
    const configurator: ConfiguratorFn<SpringProps> = () => ({
      from: { x: 0, y: 0 },
      to: { x: 100, y: 100 },
      config: key => ({ tension: key === 'y' ? 100 : 200 }),
    });
    const { from, to, config } = configurator(idx);
    const spy = jest.fn();

    ctrl.setIdx(idx);
    ctrl.setFrom(from);
    ctrl.setTo(to);
    ctrl.setSpringConfigFn(config);
    ctrl.setConfigurator(configurator);
    ctrl.getSpring().on(spy);
    ctrl.start();
    jest.runAllTimers();

    expect(spy).toHaveBeenCalledTimes(164);
    expect(spy).toHaveBeenCalledWith({ x: 5.12, y: 2.56 });
    expect(spy).toHaveBeenCalledWith({ x: 99.481, y: 87.408 });
    expect(spy).toHaveBeenCalledWith({ x: 100, y: 98.9548 });
    expect(spy).toHaveBeenLastCalledWith({ x: 100, y: 100 });
  });

  test('can animate without initial destination value', () => {
    type SpringProps = 'x';
    const ctrl = setup<SpringProps>();
    const configurator: ConfiguratorFn<SpringProps> = () => ({
      from: { x: 0 },
    });
    const { from, to, config } = configurator(idx);
    const spy = jest.fn();

    ctrl.setIdx(idx);
    ctrl.setFrom(from);
    ctrl.setTo(to);
    ctrl.setSpringConfigFn(config);
    ctrl.setConfigurator(configurator);
    ctrl.getSpring().on(spy);
    ctrl.start(() => ({ to: { x: 100 } }));
    jest.runAllTimers();

    expect(spy).toHaveBeenCalledTimes(84);
    expect(spy).toHaveBeenCalledWith({ x: 4.352 });
    expect(spy).toHaveBeenCalledWith({ x: 98.8756 });
    expect(spy).toHaveBeenCalledWith({ x: 99.9901 });
    expect(spy).toHaveBeenLastCalledWith({ x: 100 });
  });

  test('can set the immediate value', () => {
    type SpringProps = 'x' | 'zIndex';
    const ctrl = setup<SpringProps>();
    const configurator: ConfiguratorFn<SpringProps> = () => ({
      from: { x: 0, zIndex: 0 },
      to: { x: 100, zIndex: 1 },
      immediate: key => key === 'zIndex',
    });
    const { from, to, config } = configurator(idx);
    const spy = jest.fn();

    ctrl.setIdx(idx);
    ctrl.setFrom(from);
    ctrl.setTo(to);
    ctrl.setSpringConfigFn(config);
    ctrl.setConfigurator(configurator);
    ctrl.getSpring().on(spy);
    ctrl.start();
    jest.runAllTimers();

    expect(spy).toHaveBeenCalledWith({ x: 4.352, zIndex: 1 });
    expect(spy).toHaveBeenCalledWith({ x: 100, zIndex: 1 });
    spy.mockClear();

    ctrl.start(() => ({ to: { x: 0, zIndex: 0 } }));
    jest.runAllTimers();

    expect(spy).toHaveBeenCalledWith({ x: 95.648, zIndex: 1 });
    expect(spy).toHaveBeenCalledWith({ x: 0, zIndex: 1 });
    expect(spy).toHaveBeenLastCalledWith({ x: 0, zIndex: 0 });
  });

  test('can reset the value correctly', () => {
    type SpringProps = 'scale';
    const ctrl = setup<SpringProps>();
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
    ctrl.start();
    jest.runAllTimers();

    const spring = ctrl.getSpring();

    expect(spring.value()).toEqual({ scale: 2 });

    ctrl.reset();

    expect(spring.value()).toEqual({ scale: 0 });
  });

  test('can cancel the animation', () => {
    type SpringProps = 'scale';
    const ctrl = setup<SpringProps>();
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
    ctrl.start();
    ctrl.cancel();
    jest.runAllTimers();

    const spring = ctrl.getSpring();

    expect(spring.value()).toEqual({ scale: 0 });
  });
});
