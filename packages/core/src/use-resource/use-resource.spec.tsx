/** @jsx h */
import { createBrowserEnv, createBrowserHydrateEnv, createServerEnv, sleep, dom } from '@test-utils';

import { h } from '../element';
import { Fragment } from '../fragment';
import { component } from '../component';
import { Suspense } from '../suspense';
import { APP_STATE_ATTR } from '../constants';
import { useState } from '../use-state';
import { useResource } from './use-resource';

jest.spyOn(console, 'error').mockImplementation(() => {});

let { host, render } = createBrowserEnv();

beforeEach(() => {
  jest.useRealTimers();
  ({ host, render } = createBrowserEnv());
});

const fetchData = async (x: number) => {
  await sleep(5);
  return x * 10;
};
const fetchError = async () => {
  await sleep(5);
  throw new Error('oops!');
};

describe('@core/use-resource', () => {
  test('resolves an async resource correctly', async () => {
    const spy = jest.fn();
    const App = component(() => {
      const { loading, data, error } = useResource(() => fetchData(1));

      spy([loading, data, error]);

      return null;
    });

    render(<App />);
    expect(spy).toHaveBeenCalledWith([true, null, null]);
    spy.mockClear();

    await sleep(50);
    expect(spy).toHaveBeenCalledWith([false, 10, null]);
  });

  test('resolves an async resource with error correctly', async () => {
    const spy = jest.fn();
    const App = component(() => {
      const { loading, data, error } = useResource(() => fetchError());

      spy([loading, data, error]);

      return null;
    });

    render(<App />);
    expect(spy).toHaveBeenCalledWith([true, null, null]);
    spy.mockClear();

    await sleep(50);
    expect(spy).toHaveBeenCalledWith([false, null, 'Error: oops!']);
  });

  test('refetches an async resource with deps correctly', async () => {
    const spy = jest.fn();
    const App = component<{ id: number }>(({ id }) => {
      const { loading, data, error } = useResource(() => fetchData(id), [id]);

      spy([loading, data, error]);

      return null;
    });

    render(<App id={1} />);
    expect(spy).toHaveBeenCalledWith([true, null, null]);
    spy.mockClear();

    await sleep(50);
    expect(spy).toHaveBeenCalledWith([false, 10, null]);
    spy.mockClear();

    render(<App id={2} />);
    await sleep(0);
    expect(spy).toHaveBeenCalledWith([true, 10, null]);
    spy.mockClear();

    await sleep(50);
    expect(spy).toHaveBeenCalledWith([false, 20, null]);
    spy.mockClear();

    render(<App id={3} />);
    await sleep(0);
    expect(spy).toHaveBeenCalledWith([true, 20, null]);
    spy.mockClear();

    await sleep(50);
    expect(spy).toHaveBeenCalledWith([false, 30, null]);
  });

  test('resolves an async resource with suspense correctly', async () => {
    const content = (isLoading: boolean, data: number) => dom`
    ${
      isLoading
        ? '<loader>loading...</loader>'
        : `
          <child>${data}</child>
          <child>${data}</child>
          <child>${data}</child>
          <child>${data}</child>
          <child>${data}</child>
          <child>${data}</child>
        `
    }`;
    const Child = component(() => {
      const { loading, data } = useResource(() => fetchData(1));

      if (loading) return <div>...</div>;

      return <child>{data}</child>;
    });
    const App = component(() => {
      return (
        <Suspense fallback={<loader>loading...</loader>}>
          <>
            <>
              <Child />
              <Child />
              <Child />
              <Child />
              <Child />
              <Child />
            </>
          </>
        </Suspense>
      );
    });

    render(<App />);
    expect(host.innerHTML).toBe(content(true, null));

    await sleep(50);
    expect(host.innerHTML).toBe(content(false, 10));
  });

  test('renders an async resource on the server correctly', async () => {
    const content = (data1: number, data2: number) => dom`
      <div>
        <div>${data1}</div>
        <div>${data2}</div>
      </div>
      <script ${APP_STATE_ATTR}="true">"eyIxIjpbMTAsbnVsbF0sIjIiOlsyMCxudWxsXX0="</script>
    `;
    const Child = component(() => {
      const { loading, data, error } = useResource(() => fetchData(2));

      if (loading) return <div>loading...</div>;
      if (error) return <div>{error}</div>;

      return <div>{data}</div>;
    });
    const App = component(() => {
      const { loading, data, error } = useResource(() => fetchData(1));

      if (loading) return <div>loading...</div>;
      if (error) return <div>{error}</div>;

      return (
        <div>
          <div>{data}</div>
          <Child />
        </div>
      );
    });
    const { renderToString } = createServerEnv();
    const result = await renderToString(<App />);

    expect(result).toBe(content(10, 20));
  });

  test('hydrates an async resource correctly', () => {
    const content = (marker: string, data1: number, data2: number, isHydrated = false) => dom`
      <div>
        <div>${marker}:${data1}</div>
        <div>${data2}</div>
      </div>
      ${!isHydrated ? `<script ${APP_STATE_ATTR}="true">"eyIxIjpbMTAsbnVsbF0sIjIiOlsyMCxudWxsXX0="</script>` : ''}
    `;
    let setMarker: (x: string) => void = null;
    const Child = component(() => {
      const { loading, data, error } = useResource(() => fetchData(2));

      if (loading) return <div>loading...</div>;
      if (error) return <div>{error}</div>;

      return <div>{data}</div>;
    });
    const App = component(() => {
      const [marker, _setMarker] = useState('a');
      const { loading, data, error } = useResource(() => fetchData(1));

      setMarker = _setMarker;

      if (loading) return <div>loading...</div>;
      if (error) return <div>{error}</div>;

      return (
        <div>
          <div>
            {marker}:{data}
          </div>
          <Child />
        </div>
      );
    });
    const { host, hydrate } = createBrowserHydrateEnv(content('a', 10, 20));

    hydrate(<App />);
    expect(host.innerHTML).toBe(content('a', 10, 20, true));

    setMarker('b');
    expect(host.innerHTML).toBe(content('b', 10, 20, true));
  });
});
