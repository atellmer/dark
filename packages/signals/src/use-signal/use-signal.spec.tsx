import { component } from '@dark-engine/core';
import { createBrowserEnv } from '@test-utils';

import { useSignal } from './use-signal';

let { render } = createBrowserEnv();

beforeEach(() => {
  ({ render } = createBrowserEnv());
});

describe('@signals/use-signal', () => {
  test('use-signal provides stable signal between renders', () => {
    const spy = jest.fn();
    const App = component(() => {
      const signal$ = useSignal(1);

      spy(signal$);

      return null;
    });

    render(<App />);
    render(<App />);
    render(<App />);
    expect(spy.mock.calls[0][0] === spy.mock.calls[1][0]).toBe(true);
    expect(spy.mock.calls[1][0] === spy.mock.calls[2][0]).toBe(true);
  });
});
