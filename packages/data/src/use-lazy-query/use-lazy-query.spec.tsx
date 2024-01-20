/** @jsx h */
import { type DarkElement, h, component } from '@dark-engine/core';
import { createBrowserEnv, sleep, waitUntilEffectsStart } from '@test-utils';

import { InMemoryCache } from '../cache';
import { DataClient, DataProvider } from '../client';
import { type Query } from '../use-query';
import { useLazyQuery } from './use-lazy-query';

enum Key {
  GET_DATA = 'GET_DATA',
}

const createClient = () => new DataClient({ api: {}, cache: new InMemoryCache() });
const withProvider = (app: DarkElement) => <DataProvider client={client}>{app}</DataProvider>;

let { render } = createBrowserEnv();
let client = createClient();

jest.spyOn(console, 'error').mockImplementation(() => {});

beforeEach(() => {
  jest.useRealTimers();
  ({ render } = createBrowserEnv());
  client = createClient();
});

const api = {
  async getData(x: number) {
    await sleep(5);
    return x * 10;
  },
};

describe('@data/use-lazy-query', () => {
  test('makes a query correctly', async () => {
    const spy1 = jest.fn();
    const spy2 = jest.fn();
    let getData: Query<number, { x: number }> = null;
    const App = component(() => {
      const [_getData, { isFetching, data, error }] = useLazyQuery(Key.GET_DATA, ({ x }) => api.getData(x), {
        variables: { x: 10 },
        onSuccess: ({ args, data }) => spy2([args, data]),
      });

      getData = _getData;
      spy1(isFetching, data, error);

      return null;
    });

    render(withProvider(<App />));
    await waitUntilEffectsStart();
    await sleep(0);
    expect(spy1).toHaveBeenCalledTimes(1);

    await getData({ x: 1 });

    expect(spy1).toHaveBeenCalledTimes(3);
    expect(spy1.mock.calls).toEqual([
      [false, null, null],
      [true, null, null],
      [false, 10, null],
    ]);
    expect(spy2).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledWith([{ x: 1 }, 10]);
  });
});
