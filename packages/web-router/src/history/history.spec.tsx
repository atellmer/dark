/** @jsx h */
import { resetBrowserHistory } from '@test-utils';

import { createRouterHistory } from './history';

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

    history.push('/first');
    expect(subscriber).lastCalledWith('/first/');

    history.push('/second');
    expect(subscriber).lastCalledWith('/second/');

    history.push('/second/a/1');
    expect(subscriber).lastCalledWith('/second/a/1/');

    history.forward();
    expect(subscriber).lastCalledWith('/second/a/1/');

    history.forward();
    expect(subscriber).lastCalledWith('/second/a/1/');

    history.back();
    expect(subscriber).lastCalledWith('/second/');

    history.back();
    expect(subscriber).lastCalledWith('/first/');

    history.back();
    expect(subscriber).lastCalledWith('/');

    history.back();
    expect(subscriber).lastCalledWith('/');

    history.go(1000);
    expect(subscriber).lastCalledWith('/second/a/1/');

    history.go(-10000);
    expect(subscriber).lastCalledWith('/');

    history.push('/third');
    expect(subscriber).lastCalledWith('/third/');

    history.push('/third');
    expect(subscriber).lastCalledWith('/third/');
  });

  test('can unsubscribe correctly', () => {
    const subscriber = jest.fn();
    const history = createRouterHistory('/');

    const unsubscribe = history.subscribe(subscriber);

    history.push('/first');
    expect(subscriber).toBeCalledTimes(1);

    history.push('/second');
    expect(subscriber).toBeCalledTimes(2);

    unsubscribe();
    history.push('/third');
    expect(subscriber).toBeCalledTimes(2);

    history.push('/fourth');
    expect(subscriber).toBeCalledTimes(2);
  });
});
