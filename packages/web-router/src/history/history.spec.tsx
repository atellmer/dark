/** @jsx h */
import { resetBrowserHistory } from '@test-utils';

import { createRouterHistory } from './history';

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  resetBrowserHistory();
});

describe('@web-router/history', () => {
  test('throws error when incorrect initialization occurs', () => {
    expect(() => createRouterHistory(null)).toThrowError();
  });

  test('can work with own state correctly', () => {
    const subscriber = jest.fn();
    const history = createRouterHistory('/');

    history.subscribe(subscriber);
    expect(location.href).toBe('http://localhost/');

    history.push('/first');
    jest.runAllTimers();
    expect(subscriber).lastCalledWith('/first/');
    expect(location.href).toBe('http://localhost/first/');

    history.push('/second');
    jest.runAllTimers();
    expect(subscriber).lastCalledWith('/second/');
    expect(location.href).toBe('http://localhost/second/');

    history.push('/second/a/1');
    jest.runAllTimers();
    expect(subscriber).lastCalledWith('/second/a/1/');
    expect(location.href).toBe('http://localhost/second/a/1/');

    history.forward();
    jest.runAllTimers();
    expect(subscriber).lastCalledWith('/second/a/1/');
    expect(location.href).toBe('http://localhost/second/a/1/');

    history.forward();
    jest.runAllTimers();
    expect(subscriber).lastCalledWith('/second/a/1/');
    expect(location.href).toBe('http://localhost/second/a/1/');

    history.back();
    jest.runAllTimers();
    expect(subscriber).lastCalledWith('/second/');
    expect(location.href).toBe('http://localhost/second/');

    history.back();
    jest.runAllTimers();
    expect(subscriber).lastCalledWith('/first/');
    expect(location.href).toBe('http://localhost/first/');

    history.back();
    jest.runAllTimers();
    expect(subscriber).lastCalledWith('/');
    expect(location.href).toBe('http://localhost/');

    history.back();
    jest.runAllTimers();
    expect(subscriber).lastCalledWith('/');
    expect(location.href).toBe('http://localhost/');

    history.go(1000);
    jest.runAllTimers();
    expect(subscriber).lastCalledWith('/second/a/1/');
    expect(location.href).toBe('http://localhost/second/a/1/');

    history.go(-10000);
    jest.runAllTimers();
    expect(subscriber).lastCalledWith('/');
    expect(location.href).toBe('http://localhost/');

    history.push('/third');
    jest.runAllTimers();
    expect(subscriber).lastCalledWith('/third/');
    expect(location.href).toBe('http://localhost/third/');

    history.push('/third');
    jest.runAllTimers();
    expect(subscriber).lastCalledWith('/third/');
    expect(location.href).toBe('http://localhost/third/');
  });

  test('can unsubscribe correctly', () => {
    const subscriber = jest.fn();
    const history = createRouterHistory('/');
    const unsubscribe = history.subscribe(subscriber);

    history.push('/first');
    jest.runAllTimers();
    expect(subscriber).toBeCalledTimes(1);

    history.push('/second');
    jest.runAllTimers();
    expect(subscriber).toBeCalledTimes(2);

    unsubscribe();
    history.push('/third');
    jest.runAllTimers();
    expect(subscriber).toBeCalledTimes(2);

    history.push('/fourth');
    jest.runAllTimers();
    expect(subscriber).toBeCalledTimes(2);
  });
});
