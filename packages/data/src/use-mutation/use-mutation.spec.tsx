/** @jsx h */
import { type DarkElement, h, component } from '@dark-engine/core';
import { createBrowserEnv, sleep } from '@test-utils';

import { InMemoryCache } from '../cache';
import { DataClient, DataProvider } from '../client';
import { useQuery } from '../use-query';
import { useMutation } from './use-mutation';

enum Key {
  GET_DATA = 'GET_DATA',
  ADD_DATA = 'ADD_DATA',
}

const createClient = () => new DataClient({ api: {}, cache: new InMemoryCache() });
const withProvider = (app: DarkElement) => <DataProvider client={client}>{app}</DataProvider>;
let { render } = createBrowserEnv();
let client = createClient();
let count = 0;

jest.spyOn(console, 'error').mockImplementation(() => {});

beforeEach(() => {
  jest.useRealTimers();
  ({ render } = createBrowserEnv());
  client = createClient();
  count = 0;
});

const api = {
  count: 0,
  async getData() {
    await sleep(5);
    return count * 10;
  },
  async addData(x: number, error?: boolean) {
    await sleep(5);
    if (error) throw new Error('oops!');
    count = x;
    return true;
  },
};

describe('@data/use-mutation', () => {
  test('makes a mutation correctly', async () => {
    const spy1 = jest.fn();
    const spy2 = jest.fn();
    let addData: typeof api.addData = null;
    const App = component(() => {
      const [_addData, { loading, data, error }] = useMutation(api.addData, {
        key: Key.ADD_DATA,
        onSuccess: ({ args, data }) => spy2([args, data]),
      });

      spy1(loading, data, error);
      addData = _addData;

      return null;
    });

    render(withProvider(<App />));
    await sleep(10);
    await addData(1);
    await sleep(20);

    expect(spy1).toHaveBeenCalledTimes(3);
    expect(spy1.mock.calls).toEqual([
      [false, null, null],
      [true, null, null],
      [false, true, null],
    ]);
    expect(spy2).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledWith([[1], true]);
  });

  test('returns an error if the mutation fails', async () => {
    const spy1 = jest.fn();
    const spy2 = jest.fn();
    let addData: typeof api.addData = null;
    const App = component(() => {
      const [_addData, { loading, data, error }] = useMutation(api.addData, {
        key: Key.ADD_DATA,
        onSuccess: ({ args, data }) => spy2([args, data]),
      });

      spy1([loading, data, error]);
      addData = _addData;

      return null;
    });

    render(withProvider(<App />));
    await sleep(0);
    addData(1, true);
    await sleep(20);

    expect(spy1.mock.calls).toEqual([[[false, null, null]], [[true, null, null]], [[false, null, 'Error: oops!']]]);
    expect(spy2).not.toHaveBeenCalled();
  });

  test('refetches queries if the mutation is complete', async () => {
    const spy = jest.fn();
    let addData: typeof api.addData = null;
    const App = component(() => {
      const { data, loading } = useQuery(api.getData, { key: Key.GET_DATA });
      const [_addData] = useMutation(api.addData, {
        key: Key.ADD_DATA,
        refetchQueries: [Key.GET_DATA],
      });

      spy(loading, data);
      addData = _addData;

      return null;
    });

    render(withProvider(<App />));
    await sleep(0);

    await sleep(10);
    await addData(1);
    await sleep(20);

    expect(spy.mock.calls).toEqual([
      [true, null],
      [false, 0],
      [false, 0],
      [true, 0],
      [true, 0],
      [false, 10],
    ]);
  });
});
