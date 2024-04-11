import { type DarkElement, component } from '@dark-engine/core';
import { createBrowserEnv, sleep, waitUntilEffectsStart } from '@test-utils';

import { InMemoryCache } from '../cache';
import { DataClient, DataClientProvider } from '../client';
import { useQuery } from '../use-query';
import { useMutation } from './use-mutation';

enum Key {
  GET_DATA = 'GET_DATA',
  ADD_DATA = 'ADD_DATA',
}

const createClient = () => new DataClient({ api: {}, cache: new InMemoryCache() });
const withProvider = (app: DarkElement) => <DataClientProvider client={client}>{app}</DataClientProvider>;
const waitQuery = () => sleep(5);

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
      const [_addData, { isFetching, data, error }] = useMutation(Key.ADD_DATA, api.addData, {
        onSuccess: ({ args, data }) => spy2([args, data]),
      });

      addData = _addData;
      spy1(isFetching, data, error);

      return null;
    });

    render(withProvider(<App />));
    await waitUntilEffectsStart();
    await addData(1);

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
      const [_addData, { isFetching, data, error }] = useMutation(Key.ADD_DATA, api.addData, {
        onSuccess: ({ args, data }) => spy2([args, data]),
      });

      addData = _addData;
      spy1([isFetching, data, error]);

      return null;
    });

    render(withProvider(<App />));
    await waitUntilEffectsStart();
    await addData(1, true);

    expect(spy1.mock.calls).toEqual([[[false, null, null]], [[true, null, null]], [[false, null, 'Error: oops!']]]);
    expect(spy2).not.toHaveBeenCalled();
  });

  test('refetches queries if the mutation is complete', async () => {
    const spy = jest.fn();
    let addData: typeof api.addData = null;
    const App = component(() => {
      const { isFetching, data } = useQuery(Key.GET_DATA, api.getData);
      const [_addData] = useMutation(Key.ADD_DATA, api.addData, { refetchQueries: [Key.GET_DATA] });

      addData = _addData;
      spy(isFetching, data);

      return null;
    });

    render(withProvider(<App />));
    await waitUntilEffectsStart();
    await waitQuery();
    await addData(1);
    await waitQuery();

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
