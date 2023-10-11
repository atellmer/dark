/** @jsx h */
import { render } from '@dark-engine/platform-browser';
import { setupPorts, unrefPorts } from '@dark-engine/platform-browser/scheduler';

import { dom, sleep } from '@test-utils';
import { h } from '../element';
import { component } from '../component';
import { useEffect } from '../use-effect';
import { useState } from '../use-state';
import { useDeferredValue } from './use-deferred-value';

let host: HTMLElement = null;

beforeAll(() => {
  jest.useRealTimers();
  setupPorts();
});

beforeEach(() => {
  host = document.createElement('div');
});

afterAll(() => {
  unrefPorts();
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

    render(<App />, host);
    expect(host.innerHTML).toBe(content(0));
    await sleep();
    expect(host.innerHTML).toBe(content(1));
    expect(spy).toHaveBeenCalledTimes(3);
  });
});
