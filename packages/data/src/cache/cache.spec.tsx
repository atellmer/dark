/** @jsx h */
import * as core from '@dark-engine/core';

import { InMemoryCache, type CacheEventData, type MonitorEventData } from '../cache';
import { ROOT_ID } from '../constants';

const TIME = 1705647402757;
enum Key {
  ITEMS = 'ITEMS',
  CURRENT_ITEM = 'CURRENT_ITEM',
}

jest.mock('@dark-engine/core', () => {
  return {
    __esModule: true,
    ...jest.requireActual('@dark-engine/core'),
  };
});

jest.spyOn(core, 'getTime').mockImplementation(() => TIME);

describe('@data/cache', () => {
  test('has required public methods', () => {
    const cahce = new InMemoryCache();

    expect(cahce.getState).toBeDefined();
    expect(cahce.read).toBeDefined();
    expect(cahce.write).toBeDefined();
    expect(cahce.delete).toBeDefined();
    expect(cahce.optimistic).toBeDefined();
    expect(cahce.invalidate).toBeDefined();
    expect(cahce.subscribe).toBeDefined();
    expect(cahce.monitor).toBeDefined();
  });

  test('wtites and reads the data correctly', () => {
    const cache = new InMemoryCache();

    cache.write(Key.CURRENT_ITEM, 1, { id: 1 });
    expect(cache.read(Key.CURRENT_ITEM, { id: 1 })).toEqual({
      data: 1,
      id: 1,
      modifiedAt: TIME,
      valid: true,
    });

    cache.write(Key.CURRENT_ITEM, 2, { id: 1 });
    expect(cache.read(Key.CURRENT_ITEM, { id: 1 })).toEqual({
      data: 2,
      id: 1,
      modifiedAt: TIME,
      valid: true,
    });

    cache.write(Key.ITEMS, [1, 2, 3]);
    expect(cache.read(Key.ITEMS)).toEqual({
      data: [1, 2, 3],
      id: ROOT_ID,
      modifiedAt: TIME,
      valid: true,
    });
  });

  test('invalidates the data correctly', () => {
    const cache = new InMemoryCache();

    cache.write(Key.CURRENT_ITEM, 1, { id: 1 });
    cache.invalidate(Key.CURRENT_ITEM, { id: 1 });
    expect(cache.read(Key.CURRENT_ITEM, { id: 1 })).toEqual({
      data: 1,
      id: 1,
      modifiedAt: TIME,
      valid: false,
    });

    cache.write(Key.CURRENT_ITEM, 2, { id: 1 });
    expect(cache.read(Key.CURRENT_ITEM, { id: 1 })).toEqual({
      data: 2,
      id: 1,
      modifiedAt: TIME,
      valid: true,
    });
  });

  test('the optimistic method works correctly', () => {
    const cache = new InMemoryCache();

    cache.write(Key.CURRENT_ITEM, 1, { id: 1 });
    cache.optimistic(Key.CURRENT_ITEM, 100, { id: 1 });
    expect(cache.read(Key.CURRENT_ITEM, { id: 1 })).toEqual({
      data: 100,
      id: 1,
      modifiedAt: TIME,
      valid: false,
    });
  });

  test('deletes record correctly', () => {
    const cache = new InMemoryCache();

    cache.write(Key.CURRENT_ITEM, 1, { id: 1 });
    cache.delete(Key.CURRENT_ITEM, { id: 1 });
    expect(cache.read(Key.CURRENT_ITEM, { id: 1 })).toBe(null);
  });

  test('returns the state correctly', () => {
    const cache = new InMemoryCache();

    cache.write(Key.CURRENT_ITEM, 1, { id: 1 });
    expect(cache.getState()).toEqual({
      [Key.CURRENT_ITEM]: {
        1: {
          data: 1,
          id: 1,
          modifiedAt: TIME,
          valid: true,
        },
      },
    });
  });

  test('subscribes on the cache events correctly', () => {
    const spy = jest.fn();
    const cache = new InMemoryCache();

    cache.subscribe(spy);
    cache.write(Key.ITEMS, [1, 2, 3]);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({
      id: ROOT_ID,
      key: Key.ITEMS,
      record: {
        data: [1, 2, 3],
        id: ROOT_ID,
        modifiedAt: TIME,
        valid: true,
      },
      type: 'write',
    } as CacheEventData<Key>);
    spy.mockClear();

    cache.invalidate(Key.ITEMS);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({
      id: ROOT_ID,
      key: Key.ITEMS,
      record: {
        data: [1, 2, 3],
        id: ROOT_ID,
        modifiedAt: TIME,
        valid: false,
      },
      type: 'invalidate',
    } as CacheEventData<Key>);
    spy.mockClear();

    cache.optimistic(Key.ITEMS, [10, 20, 30]);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({
      id: ROOT_ID,
      key: Key.ITEMS,
      record: {
        data: [10, 20, 30],
        id: ROOT_ID,
        modifiedAt: TIME,
        valid: false,
      },
      type: 'optimistic',
    } as CacheEventData<Key>);
    spy.mockClear();

    cache.delete(Key.ITEMS);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({
      id: ROOT_ID,
      key: Key.ITEMS,
      type: 'delete',
    } as CacheEventData<Key>);
  });

  test('subscribes on the monitor events correctly', () => {
    const spy = jest.fn();
    const cache = new InMemoryCache();

    cache.monitor(spy);
    cache.write(Key.ITEMS, [1, 2, 3]);
    cache.__emit({ key: Key.ITEMS, phase: 'start', type: 'query' });

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({ key: Key.ITEMS, phase: 'start', type: 'query' } as MonitorEventData<Key>);
    spy.mockClear();
  });
});
