/** @jsx h */
import { render } from '@dark-engine/platform-browser';

import { dom } from '@test-utils';
import { h } from '../element';
import { component } from '../component';
import { useEffect } from '../use-effect';
import { useState } from '../use-state';
import { useDeferredValue } from './use-deferred-value';

let host: HTMLElement = null;
let timerId = 0;

jest.useFakeTimers();

beforeEach(() => {
  host = document.createElement('div');
  timerId = 0;
  jest.spyOn(window, 'requestIdleCallback').mockImplementation((cb): number => {
    timerId++;
    setTimeout(() => cb({} as IdleDeadline));

    return timerId;
  });
});

describe('[use-deferred-value]', () => {
  test('can make a deferred render', () => {
    const mockFn = jest.fn();

    const content = (value: number) => dom`
      <div>${value}</div>
    `;

    const App = component(() => {
      const [value, setValue] = useState(0);
      const deferred = useDeferredValue(value);

      useEffect(() => {
        setValue(1);
      }, []);

      mockFn();

      return <div>{deferred}</div>;
    });

    render(<App />, host);
    expect(host.innerHTML).toBe(content(0));
    jest.runAllTimers();
    expect(host.innerHTML).toBe(content(1));
    expect(mockFn).toHaveBeenCalledTimes(3);
  });
});
