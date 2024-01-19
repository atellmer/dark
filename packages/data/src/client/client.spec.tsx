/** @jsx h */
import { h, component } from '@dark-engine/core';
import * as core from '@dark-engine/core';
import { createBrowserEnv } from '@test-utils';

import { InMemoryCache, type WriteOptions, type MonitorEventData, MonitorEventType } from '../cache';
import { DataClient, DataProvider, useApi, useCache, useClient } from '../client';
import { ROOT_ID } from '../constants';

const TIME = 1705647402757;

jest.mock('@dark-engine/core', () => {
  return {
    __esModule: true,
    ...jest.requireActual('@dark-engine/core'),
  };
});

jest.spyOn(core, 'getTime').mockImplementation(() => TIME);

enum Key {
  DATA = 'DATA',
}
type Api = { fn: Function };
const api: Api = { fn: () => {} };
const cache = new InMemoryCache();
const createClient = () => new DataClient({ api, cache });

let { render } = createBrowserEnv();

beforeEach(() => {
  jest.useRealTimers();
  ({ render } = createBrowserEnv());
});

describe('@data/client', () => {
  test('has required public methods', () => {
    const client = createClient();

    expect(client.getApi).toBeDefined();
    expect(client.getCache).toBeDefined();
    expect(client.subscribe).toBeDefined();
    expect(client.monitor).toBeDefined();
  });

  test('returns the objects correctly', () => {
    const client = createClient();

    expect(client.getApi()).toBe(api);
    expect(client.getCache()).toBe(cache);
  });

  test('subscribes on cache events correctly', () => {
    const spy = jest.fn();
    const client = createClient();
    const cache = client.getCache();
    const off1 = client.subscribe(spy);
    const off2 = client.monitor(spy);
    const options: WriteOptions<number, Key> = { key: Key.DATA, data: 1 };
    const data: MonitorEventData<Key> = { key: Key.DATA, phase: 'start', type: MonitorEventType.QUERY, data: 2 };

    cache.write(options);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({
      id: ROOT_ID,
      key: Key.DATA,
      record: {
        id: ROOT_ID,
        data: 1,
        modifiedAt: TIME,
        valid: true,
      },
      type: 'write',
    });
    spy.mockClear();

    cache.__emit(data);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(data);
    spy.mockClear();

    expect(typeof off1).toBe('function');
    expect(typeof off2).toBe('function');

    off1();
    off2();
    cache.write({ key: Key.DATA, data: 2 });
    cache.__emit(data);

    expect(spy).not.toHaveBeenCalled();
  });

  test('provides the objects correctly', () => {
    let $client: DataClient<Api, Key> = null;
    let $api: Api = null;
    let $cache: InMemoryCache<Key> = null;
    const App = component(() => {
      $client = useClient<Api, Key>();
      $api = useApi<Api>();
      $cache = useCache<Key>();

      return null;
    });

    const client = createClient();
    const content = (
      <DataProvider client={client}>
        <App />
      </DataProvider>
    );

    render(content);
    expect($client).toBe(client);
    expect($api).toBe(api);
    expect($cache).toBe(cache);
  });
});
