/** @jsx h */
import { platform } from '@dark-engine/core';
import { dom, sleep, createEnv } from '@test-utils';

import { h } from '../element';
import { scheduler } from '../scheduler';
import { component } from '../component';
import { useEffect } from '../use-effect';
import { useState } from '../use-state';
import { useDeferredValue } from './use-deferred-value';

jest.spyOn(platform, 'spawn').mockImplementation(cb => setTimeout(cb));

let { host, render } = createEnv();

beforeAll(() => {
  scheduler.setupPorts();
});

beforeEach(() => {
  jest.useRealTimers();
  ({ host, render } = createEnv());
});

afterAll(() => {
  scheduler.unrefPorts();
});

describe('[use-deferred-value]', () => {
  test('can make a deferred render', async () => {
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
    expect(host.innerHTML).toBe(content(0));
    await sleep(20);
    expect(host.innerHTML).toBe(content(1));
    expect(spy).toHaveBeenCalledTimes(3);
  });
});
