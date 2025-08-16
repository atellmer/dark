import { component } from '@dark-engine/core';
import { createBrowserEnv } from '@test-utils';

import { signal } from '../signal';
import { useSignalEffect } from './use-signal-effect';

let { render } = createBrowserEnv();

beforeEach(() => {
  ({ render } = createBrowserEnv());
  jest.useFakeTimers();
});

describe('@signals/use-signal-effect', () => {
  test('use-signal-effect run effects correctly', () => {
    const count$ = signal(10);
    const spy = jest.fn();
    const App = component(() => {
      useSignalEffect(() => spy(count$.get()));

      return null;
    });

    render(<App />);
    jest.runAllTimers();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(10);
    count$.set(x => x + 1);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith(11);
  });

  test('use-signal-effect unmounts correctly', () => {
    const count$ = signal(10);
    const spy = jest.fn();
    const App = component(() => {
      useSignalEffect(() => spy(count$.get()));

      return null;
    });

    render(<App />);
    jest.runAllTimers();
    expect(count$.__getSize()).toBe(1);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(10);
    count$.set(x => x + 1);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith(11);
    render(null);
    spy.mockClear();
    count$.set(x => x + 1);
    expect(spy).toHaveBeenCalledTimes(0);
    expect(count$.__getSize()).toBe(0);
  });
});
