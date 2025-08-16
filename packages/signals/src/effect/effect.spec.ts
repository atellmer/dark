import { computed } from '../computed';
import { signal } from '../signal';
import { effect } from './effect';

describe('@signals/effect', () => {
  test('effect tracks signals correctly', () => {
    const count$ = signal(10);
    const spy = jest.fn();

    effect(() => {
      spy(count$.get());
    });

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(10);
    count$.set(20);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenLastCalledWith(20);
    count$.set(30);
    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveBeenLastCalledWith(30);
  });

  test('effect tracks multiple signals correctly', () => {
    const name$ = signal('Alex');
    const age$ = signal(99);
    const spy = jest.fn();

    effect(() => {
      spy(`${name$.get()} ${age$.get()}`);
    });

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('Alex 99');
    age$.set(85);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenLastCalledWith('Alex 85');
    age$.set(30);
    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveBeenLastCalledWith('Alex 30');
    name$.set('Jane');
    expect(spy).toHaveBeenCalledTimes(4);
    expect(spy).toHaveBeenLastCalledWith('Jane 30');
    spy.mockClear();
    name$.set('Mary');
    age$.set(27);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenLastCalledWith('Mary 27');
  });

  test('effect tracks computed signals correctly', () => {
    const name$ = signal('Alex');
    const age$ = signal(99);
    const nameAndAge$ = computed(() => `${name$.get()} ${age$.get()}`);
    const spy = jest.fn();

    effect(() => {
      spy(nameAndAge$.get());
    });

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('Alex 99');
    age$.set(85);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenLastCalledWith('Alex 85');
    age$.set(30);
    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveBeenLastCalledWith('Alex 30');
    name$.set('Jane');
    expect(spy).toHaveBeenCalledTimes(4);
    expect(spy).toHaveBeenLastCalledWith('Jane 30');
    spy.mockClear();
    name$.set('Mary');
    age$.set(27);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenLastCalledWith('Mary 27');
  });

  test('several effects run correctly #1', () => {
    const count$ = signal(10);
    const spy1 = jest.fn();
    const spy2 = jest.fn();

    effect(() => {
      spy1(count$.get());
    });

    effect(() => {
      spy2(count$.get());
    });

    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy1).toHaveBeenCalledWith(10);
    expect(spy2).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledWith(10);
    count$.set(20);
    expect(spy1).toHaveBeenCalledTimes(2);
    expect(spy1).toHaveBeenLastCalledWith(20);
    expect(spy2).toHaveBeenCalledTimes(2);
    expect(spy2).toHaveBeenLastCalledWith(20);
    count$.set(30);
    expect(spy1).toHaveBeenCalledTimes(3);
    expect(spy1).toHaveBeenLastCalledWith(30);
    expect(spy2).toHaveBeenCalledTimes(3);
    expect(spy2).toHaveBeenLastCalledWith(30);
  });

  test('several effects run correctly #2', () => {
    const count1$ = signal(10);
    const count2$ = signal(20);
    const spy1 = jest.fn();
    const spy2 = jest.fn();

    effect(() => {
      spy1(count1$.get());
    });

    effect(() => {
      spy2(count2$.get());
    });

    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy1).toHaveBeenCalledWith(10);
    expect(spy2).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledWith(20);
    count1$.set(20);
    count2$.set(30);
    expect(spy1).toHaveBeenCalledTimes(2);
    expect(spy1).toHaveBeenLastCalledWith(20);
    expect(spy2).toHaveBeenCalledTimes(2);
    expect(spy2).toHaveBeenLastCalledWith(30);
    count1$.set(30);
    count2$.set(40);
    expect(spy1).toHaveBeenCalledTimes(3);
    expect(spy1).toHaveBeenLastCalledWith(30);
    expect(spy2).toHaveBeenCalledTimes(3);
    expect(spy2).toHaveBeenLastCalledWith(40);
  });

  test('effect returns dispose callback', () => {
    const count$ = signal(10);
    const spy = jest.fn();

    const dispose = effect(() => {
      spy(count$.get());
    });

    expect(typeof dispose).toBe('function');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(10);
    expect(count$.__getSize()).toBe(1);
    count$.set(20);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenLastCalledWith(20);
    spy.mockClear();
    dispose();
    expect(count$.__getSize()).toBe(0);
    count$.set(30);
    expect(spy).toHaveBeenCalledTimes(0);
    count$.set(40);
    expect(spy).toHaveBeenCalledTimes(0);
  });

  test('effect provides cleanup function to callback', () => {
    const count$ = signal(10);
    const spy = jest.fn();

    effect(cleanup => {
      expect(typeof cleanup).toBe('function');
      cleanup(() => spy());
      count$.get();
    });

    expect(spy).toHaveBeenCalledTimes(0);
    count$.set(20);
    expect(spy).toHaveBeenCalledTimes(1);
    count$.set(30);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  test('effect can trigger other effects', () => {
    const count1$ = signal(10);
    const count2$ = signal(0);
    const spy = jest.fn();

    effect(() => {
      count2$.set(count1$.get());
    });

    effect(() => {
      spy(count2$.get());
    });

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(10);
    count1$.set(20);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenLastCalledWith(20);
    count1$.set(30);
    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveBeenLastCalledWith(30);
  });

  test(`effect doesn't track peeked value`, () => {
    const name$ = signal('Alex');
    const age$ = signal(99);
    const spy = jest.fn();

    effect(() => {
      spy(`${name$.get()} ${age$.peek()}`);
    });

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('Alex 99');
    name$.set('Jane');
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenLastCalledWith('Jane 99');
    spy.mockClear();
    name$.set('Mary');
    age$.set(27);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenLastCalledWith('Mary 99');
    spy.mockClear();
    name$.set('Alex');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenLastCalledWith('Alex 27');
  });
});
