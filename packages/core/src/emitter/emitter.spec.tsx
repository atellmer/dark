/** @jsx h */
import { EventEmitter } from './emitter';

type EventName = 'data';

describe('[@core/emitter]', () => {
  test('has required methods', () => {
    const emitter = new EventEmitter<EventName>();

    expect(emitter.on).toBeDefined();
    expect(emitter.emit).toBeDefined();
    expect(emitter.kill).toBeDefined();
  });

  test('the subscribtions work correctly', () => {
    const emitter = new EventEmitter<EventName>();
    const spy1 = jest.fn();
    const spy2 = jest.fn();
    const off = emitter.on('data', spy1);

    emitter.on('data', spy2);

    expect(typeof off).toBe('function');

    emitter.emit('data', 1);
    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledTimes(1);

    emitter.emit('data', 2);
    expect(spy1).toHaveBeenCalledTimes(2);
    expect(spy2).toHaveBeenCalledTimes(2);

    off();
    emitter.emit('data', 3);
    expect(spy1).toHaveBeenCalledTimes(2);
    expect(spy2).toHaveBeenCalledTimes(3);
  });

  test('the kill method works correctly', () => {
    const emitter = new EventEmitter<EventName>();
    const spy = jest.fn();

    emitter.on('data', spy);
    emitter.emit('data', 1);
    expect(spy).toHaveBeenCalledTimes(1);

    emitter.emit('data', 2);
    expect(spy).toHaveBeenCalledTimes(2);

    emitter.kill();
    emitter.emit('data', 3);
    expect(spy).toHaveBeenCalledTimes(2);
  });
});
