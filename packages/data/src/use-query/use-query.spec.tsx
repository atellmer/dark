import { type DarkElement, component, Suspense, ErrorBoundary, useState, STATE_SCRIPT_TYPE } from '@dark-engine/core';
import {
  createBrowserEnv,
  createBrowserHydrateEnv,
  createServerEnv,
  sleep,
  dom,
  waitUntilEffectsStart,
} from '@test-utils';

import { InMemoryCache } from '../cache';
import { DataClient, DataClientProvider } from '../client';
import { useQuery } from './use-query';

enum Key {
  GET_DATA = 'GET_DATA',
}

const createClient = () => new DataClient({ api: {}, cache: new InMemoryCache() });
const withProvider = (app: DarkElement) => <DataClientProvider client={client}>{app}</DataClientProvider>;
const waitQuery = () => sleep(10);

let { host, render } = createBrowserEnv();
let client = createClient();

jest.spyOn(console, 'error').mockImplementation(() => {});

beforeEach(() => {
  jest.useRealTimers();
  ({ host, render } = createBrowserEnv());
  client = createClient();
});

const api = {
  count: 0,
  async getData(x: number, error?: boolean) {
    await sleep(5);
    if (error) throw new Error('oops!');
    return x * 10;
  },
};

describe('@data/use-query', () => {
  test('resolves an async query correctly', async () => {
    const spy = jest.fn();
    const App = component(() => {
      const { isFetching, data, error } = useQuery(Key.GET_DATA, () => api.getData(1));

      spy([isFetching, data, error]);

      return null;
    });

    render(withProvider(<App />));
    await sleep(10);
    expect(spy).toHaveBeenCalledWith([false, 10, null]);
  });

  test('resolves an async query with error correctly', async () => {
    const spy = jest.fn();
    const App = component(() => {
      const { isFetching, data, error } = useQuery(Key.GET_DATA, () => api.getData(1, true));

      spy([isFetching, data, error]);

      return null;
    });

    render(withProvider(<App />));
    await sleep(10);
    expect(spy).toHaveBeenCalledWith([false, null, 'Error: oops!']);
  });

  test('refetches an async query correctly', async () => {
    const spy = jest.fn();
    const App = component<{ id: number }>(({ id }) => {
      const { isFetching, data, error } = useQuery(Key.GET_DATA, ({ id }) => api.getData(id), {
        variables: { id },
        extractId: x => x.id,
      });

      spy([isFetching, data, error]);

      return null;
    });

    render(withProvider(<App id={1} />));
    await waitQuery();
    expect(spy).toHaveBeenCalledWith([false, 10, null]);
    spy.mockClear();

    render(withProvider(<App id={2} />));
    await waitUntilEffectsStart();
    expect(spy).toHaveBeenCalledWith([true, 10, null]);
    spy.mockClear();

    await waitQuery();
    expect(spy).toHaveBeenCalledWith([false, 20, null]);
    spy.mockClear();

    render(withProvider(<App id={3} />));
    await waitUntilEffectsStart();
    expect(spy).toHaveBeenCalledWith([true, 20, null]);
    spy.mockClear();

    await waitQuery();
    expect(spy).toHaveBeenCalledWith([false, 30, null]);
  });

  test('resolves an async query with suspense correctly', async () => {
    const content = (isLoading: boolean, data: number) => dom`
    ${
      isLoading
        ? `
          <loader>loading...</loader>
          <div style="display: none;">...</div>
          <div style="display: none;">...</div>
          <div style="display: none;">...</div>
          <div style="display: none;">...</div>
          <div style="display: none;">...</div>
          <div style="display: none;">...</div>
        `
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
      const { isFetching, data } = useQuery(Key.GET_DATA, () => api.getData(1));

      if (isFetching) return <div>...</div>;

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

    render(withProvider(<App />));
    expect(host.innerHTML).toBe(content(true, null));

    await waitQuery();
    expect(host.innerHTML).toBe(content(false, 10));
  });

  test('renders an async query on the server correctly', async () => {
    const content = (data1: number, data2: number) => dom`
      <div>
        <div>${data1}</div>
        <div>${data2}</div>
      </div>
      <script type="${STATE_SCRIPT_TYPE}">"eyIxIjpbMTAsbnVsbF0sIjIiOlsyMCxudWxsXX0="</script>
    `;
    const Child = component(() => {
      const { isFetching, data, error } = useQuery(Key.GET_DATA, ({ id }) => api.getData(id), {
        variables: { id: 2 },
      });

      if (isFetching) return <div>loading...</div>;
      if (error) return <div>{error}</div>;

      return <div>{data}</div>;
    });
    const App = component(() => {
      const { isFetching, data, error } = useQuery(Key.GET_DATA, ({ id }) => api.getData(id), {
        variables: { id: 1 },
      });

      if (isFetching) return <div>loading...</div>;
      if (error) return <div>{error}</div>;

      return (
        <div>
          <div>{data}</div>
          <Child />
        </div>
      );
    });
    const { renderToString } = createServerEnv();
    const result = await renderToString(withProvider(<App />));

    expect(result).toBe(content(10, 20));
  });

  test('hydrates an async query correctly', () => {
    const content = (marker: string, data1: number, data2: number, isHydrated = false) => dom`
      <div>
        <div>${marker}:${data1}</div>
        <div>${data2}</div>
      </div>
      ${!isHydrated ? `<script type="${STATE_SCRIPT_TYPE}">"eyIxIjpbMTAsbnVsbF0sIjIiOlsyMCxudWxsXX0="</script>` : ''}
    `;
    let setMarker: (x: string) => void = null;
    const Child = component(() => {
      const { isFetching, data, error } = useQuery(Key.GET_DATA, ({ id }) => api.getData(id), {
        variables: { id: 2 },
      });

      if (isFetching) return <div>loading...</div>;
      if (error) return <div>{error}</div>;

      return <div>{data}</div>;
    });
    const App = component(() => {
      const [marker, _setMarker] = useState('a');
      const { isFetching, data, error } = useQuery(Key.GET_DATA, ({ id }) => api.getData(id), {
        variables: { id: 1 },
      });

      setMarker = _setMarker;

      if (isFetching) return <div>loading...</div>;
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
    const { body, hydrate } = createBrowserHydrateEnv({
      bodyHTML: content('a', 10, 20),
    });

    hydrate(withProvider(<App />));
    expect(body.innerHTML).toBe(content('a', 10, 20, true));

    setMarker('b');
    expect(body.innerHTML).toBe(content('b', 10, 20, true));
  });

  test('uses previous results from cache correctly', async () => {
    const spy = jest.fn();
    const App = component<{ id: number }>(({ id }) => {
      const { isFetching, data, error } = useQuery(Key.GET_DATA, ({ id }) => api.getData(id), {
        strategy: 'state-only',
        variables: { id },
        extractId: x => x.id,
      });

      spy([isFetching, data, error]);

      return null;
    });

    render(withProvider(<App id={1} />));
    expect(spy).toHaveBeenCalledWith([true, null, null]);
    await waitQuery();
    expect(spy).toHaveBeenCalledWith([false, 10, null]);
    spy.mockClear();

    render(withProvider(<App id={2} />));
    spy.mockClear();
    await waitUntilEffectsStart();
    expect(spy).toHaveBeenCalledWith([true, 10, null]);
    spy.mockClear();
    await waitQuery();
    expect(spy).toHaveBeenCalledWith([false, 20, null]);
    spy.mockClear();

    render(withProvider(<App id={1} />));
    spy.mockClear();
    await waitUntilEffectsStart();
    expect(spy).toHaveBeenCalledWith([false, 10, null]);
    spy.mockClear();

    render(withProvider(<App id={2} />));
    spy.mockClear();
    await waitUntilEffectsStart();
    expect(spy).toHaveBeenCalledWith([false, 20, null]);
    spy.mockClear();
  });

  // test.only('xxx', async () => {
  //   const DataLoader = component(() => {
  //     const { data } = useQuery(Key.GET_DATA, ({ id }) => api.getData(id, true), {
  //       variables: { id: 2 },
  //     });

  //     return <div>{data}</div>;
  //   });
  //   const App = component(() => {
  //     return (
  //       <ErrorBoundary fallback={<div>ERROR!</div>}>
  //         <DataLoader />
  //       </ErrorBoundary>
  //     );
  //   });
  //   const { renderToString } = createServerEnv();
  //   const result = await renderToString(withProvider(<App />));

  //   expect(result).toMatchInlineSnapshot(
  //     `"<div>ERROR!</div><script type="text/dark-state">"eyIxIjpbbnVsbCwiRXJyb3I6IG9vcHMhIl19"</script>"`,
  //   );
  // });
});
