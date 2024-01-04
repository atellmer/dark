/** @jsx h */
import { createBrowserEnv } from '@test-utils';

import { h } from '../element';
import { component } from '../component';
import { useState } from '../use-state';
import { useDeferredValue } from './use-deferred-value';

let { render } = createBrowserEnv();

beforeEach(() => {
  jest.useFakeTimers();
  ({ render } = createBrowserEnv());
});

describe('@core/use-deferred-value', () => {
  test('can make a deferred state update', () => {
    const spy = jest.fn();
    let setValue: (x: number) => void = null;
    const App = component(() => {
      const [value, _setValue] = useState(0);
      const deferred = useDeferredValue(value);

      setValue = _setValue;
      spy([value, deferred]);

      return null;
    });

    render(<App />);
    jest.runAllTimers();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith([0, 0]);

    setValue(1);
    jest.runAllTimers();
    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveBeenCalledWith([1, 0]);
    expect(spy).toHaveBeenLastCalledWith([1, 1]);

    setValue(2);
    jest.runAllTimers();
    expect(spy).toHaveBeenCalledTimes(5);
    expect(spy).toHaveBeenCalledWith([2, 1]);
    expect(spy).toHaveBeenLastCalledWith([2, 2]);
  });
});
