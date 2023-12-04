/** @jsx h */
import { dom, createBrowserEnv } from '@test-utils';

import { h } from '../element';
import { component } from '../component';
import { useEffect } from '../use-effect';
import { useState } from '../use-state';
import { useDeferredValue } from './use-deferred-value';

let { host, render } = createBrowserEnv();

beforeEach(() => {
  jest.useFakeTimers();
  ({ host, render } = createBrowserEnv());
});

describe('[use-deferred-value]', () => {
  test('can make a deferred render', () => {
    const spy = jest.fn();
    const content = (value: number) => dom`
      <div>${value}</div>
    `;
    const App = component(() => {
      const [value, setValue] = useState(0);
      const deferred = useDeferredValue(value);

      useEffect(() => {
        setValue(1);
      }, []);

      spy();

      return <div>{deferred}</div>;
    });

    render(<App />);
    spy.mockReset();
    expect(host.innerHTML).toBe(content(0));
    jest.advanceTimersByTime(1);
    expect(host.innerHTML).toBe(content(1));
    expect(spy).toHaveBeenCalledTimes(2);
  });
});
