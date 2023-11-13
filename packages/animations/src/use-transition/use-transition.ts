import { useMemo, useLayoutEffect, useUpdate, batch } from '@dark-engine/core';

import { type Key, type SpringValue, type SpringItem } from '../shared';
import { type AnimationEventName, type AnimationEventHandler, SharedState } from '../shared-state';
import { type BaseOptions, type StartFn, Controller } from '../controller';

export type TransitionItemOptions<T extends string> = {
  enter: SpringValue<T>;
  leave: SpringValue<T>;
  update?: SpringValue<T>;
} & Pick<BaseOptions<T>, 'from' | 'config' | 'immediate'>;

function useTransition<T extends string, I = unknown>(
  items: Array<I>,
  getKey: (x: I) => Key,
  configurator: (idx: number) => TransitionItemOptions<T>,
): [Array<TransitionItem<T, I>>, TransitionApi<T>] {
  const forceUpdate = useUpdate();
  const update = () => batch(forceUpdate);
  const state = useMemo(() => new SharedState<T>(), []);
  const scope = useMemo<Scope<T, I>>(() => ({ fakes: {}, record: {}, map: new Map(), configurator, items }), []);

  scope.configurator = configurator;

  useMemo(() => {
    const { map, fakes } = scope;
    const configurator = (idx: number) => scope.configurator(idx);
    const { ctrls, record } = data({ items, getKey, configurator, state, map });
    const { enters, leaves } = diff(scope.items, items, getKey);

    state.setCtrls(ctrls);

    for (const key of Object.keys(fakes)) {
      const ctrl = scope.map.get(key);
      const { leave } = configurator(ctrl.getIdx());

      ctrl.start(() => ({ to: leave }));
    }

    for (const key of Object.keys(enters)) {
      const idx = enters[key];
      const { from, enter, config } = configurator(idx);
      const ctrl = map.get(key);
      const item = ctrl.getItem();
      const isPlaying = state.detectIsPlaying(key);
      const fn = () => ({ to: enter, value: { ...from } });

      if (isPlaying) {
        const fake = new Controller<T, I>(state);
        const fakeKey = fake.markAsFake(key);

        fakes[fakeKey] = true;
        map.set(fakeKey, fake);
        state.addCtrl(fake);
        fake.setIdx(idx);
        fake.setItem(item);
        fake.setFrom(from);
        fake.setTo(enter);
        fake.setSpringConfigFn(config);
        fake.setConfigurator(configurator);
        fake.start(fn);
      } else {
        ctrl.start(fn);
      }
    }

    for (const key of Object.keys(leaves)) {
      const { leave } = configurator(leaves[key]);
      const ctrl = map.get(key);

      ctrl.start(() => ({ to: leave }));
    }

    scope.items = items;
    scope.record = record;
  }, [items]);

  useLayoutEffect(() => {
    const unmounts: Array<() => void> = [];
    const off = api.on('item-end', ({ key }) => {
      const { map, fakes, record } = scope;
      const ctrl = map.get(key);

      if (ctrl.detectIsFake()) {
        map.delete(key);
        delete fakes[key];
      } else if (!record[key]) {
        map.delete(key);
      } else {
        const { enter } = configurator(ctrl.getIdx());
        const off = api.on('item-change', ({ key: key$ }) => {
          if (key === key$) {
            const idx = unmounts.findIndex(x => x === off);

            off();
            update();
            idx !== -1 && unmounts.splice(idx, 1);
          }
        });

        unmounts.push(off);
        ctrl.replaceValue({ ...enter });
        ctrl.event('item-change');
      }

      update();
    });

    unmounts.push(off);

    return () => unmounts.forEach(x => x());
  }, []);

  useLayoutEffect(() => () => api.cancel(), []);

  const api = useMemo<TransitionApi<T>>(() => {
    return {
      start: state.start.bind(state),
      back: state.back.bind(state),
      cancel: state.cancel.bind(state),
      on: state.on.bind(state),
      once: state.once.bind(state),
    };
  }, []);

  const springs: Array<TransitionItem<T, I>> = [];

  for (const [key, ctrl] of scope.map) {
    const item = ctrl.getItem();

    springs.push({
      ctrl,
      item,
      key,
      getValue: () => ctrl.getValue(),
      detectIsActive: () => state.detectIsPlaying(),
    });
  }

  return [springs, api];
}

type DataOptions<T extends string, I = unknown> = {
  items: Array<I>;
  getKey: (x: I) => Key;
  configurator: (idx: number) => TransitionItemOptions<T>;
  state: SharedState<T>;
  map: Map<Key, Controller<T, I>>;
};

function data<T extends string, I = unknown>(options: DataOptions<T, I>) {
  const { items, getKey, configurator, state, map } = options;
  const record: Record<Key, I> = {};
  const ctrls = items.map((item, idx) => {
    const key = getKey(item);

    record[key] = item;

    return getController<T, I>({ idx, item, getKey, configurator, state, map });
  });

  return {
    ctrls,
    record,
  };
}

type GetControllerOptions<T extends string, I = unknown> = {
  idx: number;
  item: I;
} & Pick<DataOptions<T, I>, 'getKey' | 'configurator' | 'state' | 'map'>;

function getController<T extends string, I = unknown>(options: GetControllerOptions<T, I>) {
  const { idx, item, getKey, configurator, state, map } = options;
  const { from, enter, config } = configurator(idx);
  const key = getKey(item);
  let ctrl: Controller<T, I> = null;

  if (map.has(key)) {
    ctrl = map.get(key);
  } else {
    ctrl = new Controller<T, I>(state);
    ctrl.setKey(key);
    ctrl.setItem(item);
    map.set(key, ctrl);
  }

  ctrl.setIdx(idx);
  ctrl.setFrom(from);
  ctrl.setTo(enter);
  ctrl.setSpringConfigFn(config);
  ctrl.setConfigurator(configurator);

  return ctrl;
}

function extractKeys<I = unknown>(prevItems: Array<I>, nextItems: Array<I>, getKey: (x: I) => Key) {
  const prevKeys: Array<Key> = [];
  const nextKeys: Array<Key> = [];
  const prevKeysMap: Record<Key, boolean> = {};
  const nextKeysMap: Record<Key, boolean> = {};
  const max = Math.max(prevItems.length, nextItems.length);

  for (let i = 0; i < max; i++) {
    const prevItem = prevItems[i];
    const nextItem = nextItems[i];

    if (prevItem) {
      const prevKey = getKey(prevItem);

      prevKeysMap[prevKey] = true;
      prevKeys.push(prevKey);
    }

    if (nextItem) {
      const nextKey = getKey(nextItem);

      nextKeysMap[nextKey] = true;
      nextKeys.push(nextKey);
    }
  }

  return {
    prevKeys,
    nextKeys,
    prevKeysMap,
    nextKeysMap,
  };
}

function diff<I = unknown>(prevItems: Array<I>, nextItems: Array<I>, getKey: (x: I) => Key) {
  const { prevKeys, nextKeys, prevKeysMap, nextKeysMap } = extractKeys(prevItems, nextItems, getKey);
  let size = Math.max(prevKeys.length, nextKeys.length);
  let p = 0;
  let n = 0;
  const enters: Record<Key, number> = {};
  const leaves: Record<Key, number> = {};
  const updates: Record<Key, number> = {};
  const stable: Record<Key, number> = {};

  for (let i = 0; i < size; i++) {
    const nextKey = nextKeys[i - n] ?? null;
    const prevKey = prevKeys[i - p] ?? null;

    if (nextKey !== prevKey) {
      if (nextKey !== null && !prevKeysMap[nextKey]) {
        if (prevKey !== null && !nextKeysMap[prevKey]) {
          enters[nextKey] = i;
          leaves[prevKey] = i;
        } else {
          enters[nextKey] = i;
          p++;
          size++;
        }
      } else if (!nextKeysMap[prevKey]) {
        leaves[prevKey] = i;
        n++;
        size++;
      } else if (nextKeysMap[prevKey] && nextKeysMap[nextKey]) {
        updates[nextKey] = i;
      }
    } else if (nextKey !== null) {
      stable[nextKey] = i;
    }
  }

  return {
    enters,
    leaves,
    updates,
    stable,
  };
}

type Scope<T extends string, I = unknown> = {
  items: Array<I>;
  fakes: Record<Key, boolean>;
  configurator: (idx: number) => TransitionItemOptions<T>;
  map: Map<Key, Controller<T, I>>;
  record: Record<Key, I>;
};

export type TransitionApi<T extends string = string> = {
  start: (fn?: StartFn<T>) => void;
  back: () => void;
  cancel: () => void;
  on: (event: AnimationEventName, handler: AnimationEventHandler<T>) => () => void;
  once: (event: AnimationEventName, handler: AnimationEventHandler<T>) => () => void;
};

export type TransitionItem<T extends string = string, I = unknown> = {
  item: I;
  key: Key;
} & SpringItem<T>;

export { useTransition };
