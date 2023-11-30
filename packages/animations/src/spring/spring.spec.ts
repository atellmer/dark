import { WritableAtom } from '@dark-engine/core';

import { Spring } from './spring';

describe('[@animations/spring]', () => {
  test('has required methods', () => {
    const spring = new Spring();

    expect(spring.setProp).toBeDefined();
    expect(spring.prop).toBeDefined();
    expect(spring.notify).toBeDefined();
    expect(spring.value).toBeDefined();
    expect(spring.on).toBeDefined();
  });

  test('converts values to atoms', () => {
    type SpringProps = 'x' | 'y';
    const spring = new Spring<SpringProps>();

    spring.setProp('x', 1);
    spring.setProp('y', 2);

    expect(spring.prop('x')).toBeInstanceOf(WritableAtom);
    expect(spring.prop('x').get()).toBe(1);
    expect(spring.prop('y')).toBeInstanceOf(WritableAtom);
    expect(spring.prop('y').get()).toBe(2);
  });

  test('can convert atoms to value', () => {
    type SpringProps = 'x' | 'y';
    const spring = new Spring<SpringProps>();

    spring.setProp('x', 1);
    spring.setProp('y', 1);

    expect(spring.value()).toEqual({ x: 1, y: 1 });
  });

  test('can subscribe on the value', () => {
    type SpringProps = 'x' | 'y';
    const spring = new Spring<SpringProps>();
    const spy = jest.fn();

    spring.on(spy);
    spring.setProp('x', 0);
    spring.setProp('y', 0);
    spring.notify();
    spring.setProp('x', 1);
    spring.setProp('y', 1);
    spring.notify();

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith({ x: 0, y: 0 });
    expect(spy).toHaveBeenCalledWith({ x: 1, y: 1 });
  });

  test('can unsubscribe from the value', () => {
    type SpringProps = 'x' | 'y';
    const spring = new Spring<SpringProps>();
    const spy = jest.fn();
    const off = spring.on(spy);

    spring.setProp('x', 1);
    spring.setProp('y', 1);
    spring.notify();

    expect(typeof off).toBe('function');
    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockClear();

    off();
    spring.setProp('x', 2);
    spring.setProp('y', 2);
    spring.notify();
    expect(spy).toHaveBeenCalledTimes(0);
  });
});
