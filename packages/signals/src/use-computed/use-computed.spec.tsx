import { component } from '@dark-engine/core';
import { createBrowserEnv, createServerEnv } from '@test-utils';

import { signal } from '../signal';
import { useSignal } from '../use-signal';
import { useComputed } from './use-computed';

let { render } = createBrowserEnv();

beforeEach(() => {
  ({ render } = createBrowserEnv());
});

describe('@signals/use-computed', () => {
  test('use-computed provides stable signal between renders', () => {
    const spy = jest.fn();
    const count$ = signal(0);
    const App = component(() => {
      const computed$ = useComputed(() => count$.get() + 1);

      spy(computed$);

      return null;
    });

    render(<App />);
    render(<App />);
    render(<App />);
    expect(spy.mock.calls[0][0] === spy.mock.calls[1][0]).toBe(true);
    expect(spy.mock.calls[1][0] === spy.mock.calls[2][0]).toBe(true);
  });

  test('renders on the server correctly', async () => {
    const App = component(() => {
      const count$ = useSignal(1);
      const computed$ = useComputed(() => count$.get() + 10);

      return <button onClick={() => count$.set(2)}>{computed$.get()}</button>;
    });
    const { renderToString } = createServerEnv();
    const result = await renderToString(<App />);

    expect(result).toMatchInlineSnapshot(`"<button>11</button>"`);
  });
});
