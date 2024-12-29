import { createBrowserEnv, sleep } from '@test-utils';

import { component } from '../component';
import { useState } from '../use-state';
import { Suspense } from '../suspense';
import { useError, ErrorBoundary } from './boundary';

let { host, render } = createBrowserEnv();
let reset: () => void = null;

beforeEach(() => {
  ({ host, render } = createBrowserEnv());
  reset = null;
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

describe('@core/error-boundary', () => {
  type Props = {
    hasError?: boolean;
  };

  const Chlld = component<Props>(({ hasError }) => {
    if (hasError) {
      throw new Error();
    }

    return <div>child</div>;
  });

  test('use-error catches error correctly', () => {
    const App = component<Props>(({ hasError }) => {
      const [error, _reset] = useError();

      reset = _reset;

      if (error) return <div>error</div>;

      return <Chlld hasError={hasError} />;
    });

    render(<App />);
    expect(host.innerHTML).toMatchInlineSnapshot(`"<div>child</div>"`);

    render(<App hasError />);
    expect(host.innerHTML).toMatchInlineSnapshot(`"<div>error</div>"`);

    render(<App />);
    expect(host.innerHTML).toMatchInlineSnapshot(`"<div>error</div>"`);
    reset();
    expect(host.innerHTML).toMatchInlineSnapshot(`"<div>child</div>"`);
  });

  test('use-error works correctly with deeply children', () => {
    const App = component<Props>(({ hasError }) => {
      const [error, _reset] = useError();

      reset = _reset;

      if (error) return <div>error</div>;

      return (
        <>
          <div>header</div>
          <div>
            <div>
              <div>
                <Chlld hasError={hasError} />
              </div>
            </div>
          </div>
          <div>footer</div>
        </>
      );
    });

    render(<App />);
    expect(host.innerHTML).toMatchInlineSnapshot(
      `"<div>header</div><div><div><div><div>child</div></div></div></div><div>footer</div>"`,
    );

    render(<App hasError />);
    expect(host.innerHTML).toMatchInlineSnapshot(`"<div>error</div>"`);

    render(<App />);
    expect(host.innerHTML).toMatchInlineSnapshot(`"<div>error</div>"`);

    reset();
    expect(host.innerHTML).toMatchInlineSnapshot(
      `"<div>header</div><div><div><div><div>child</div></div></div></div><div>footer</div>"`,
    );
  });

  test(`pass some options into the error-boundary\'s fallback`, () => {
    const spy = jest.fn();
    const Child = component(() => {
      throw new Error();
    });
    const App = component(() => {
      return (
        <ErrorBoundary
          renderFallback={x => {
            spy(x);
            return <div>ERROR!</div>;
          }}>
          <Child />
        </ErrorBoundary>
      );
    });

    render(<App />);
    expect(spy.mock.calls).toMatchInlineSnapshot(`
      [
        [
          {
            "error": [Error],
            "reset": [Function],
          },
        ],
      ]
    `);
  });

  test('error-boundary works with sync errors correctly', () => {
    const Child = component<Props>(({ hasError }) => {
      if (hasError) {
        throw new Error('error');
      }

      return <div>hello</div>;
    });
    const App = component<Props>(({ hasError }) => {
      return (
        <ErrorBoundary
          renderFallback={({ reset: _reset }) => {
            reset = _reset;
            return <div>ERROR!</div>;
          }}>
          <Child hasError={hasError} />
        </ErrorBoundary>
      );
    });

    render(<App hasError />);
    expect(host.innerHTML).toMatchInlineSnapshot(`"<div>ERROR!</div>"`);

    render(<App />);
    reset();
    expect(host.innerHTML).toMatchInlineSnapshot(`"<div>hello</div>"`);
  });

  test('error-boundary works with async errors correctly', async () => {
    const make = (hasError: boolean) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          hasError ? reject('error') : resolve('hello');
        }, 10);
      });
    };
    const DataLoader = component<Props>(({ hasError }) => {
      const [data, setData] = useState(null);

      if (data === null) {
        setData(undefined);
        throw make(hasError).then(x => setData(x));
      }

      return <div>{data}</div>;
    });
    const App = component<Props>(({ hasError }) => {
      return (
        <ErrorBoundary
          renderFallback={({ reset: _reset }) => {
            reset = _reset;
            return <div>ERROR!</div>;
          }}>
          <Suspense fallback={<div>LOADING...</div>}>
            <DataLoader hasError={hasError} />
          </Suspense>
        </ErrorBoundary>
      );
    });

    render(<App hasError />);
    await sleep(10);
    expect(host.innerHTML).toMatchInlineSnapshot(`"<div>ERROR!</div>"`);

    render(<App />);
    reset();
    await sleep(1);
    expect(host.innerHTML).toMatchInlineSnapshot(`"<div>LOADING...</div><div style="display: none;"></div>"`);

    await sleep(10);
    expect(host.innerHTML).toMatchInlineSnapshot(`"<div>hello</div>"`);
  });
});
