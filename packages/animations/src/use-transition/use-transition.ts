import { useMemo, useLayoutEffect, useUpdate } from '@dark-engine/core';

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
  const update = useUpdate();
  const state = useMemo(() => new SharedState<T>(), []);
  const scope = useMemo<Scope<T, I>>(() => {
    const map: Map<Key, Controller<T, I>> = new Map();
    const ctrls = items.map(x => createController<T, I>(state, x, getKey, map));

    state.setCtrls(ctrls);
    prepare(ctrls, configurator);

    return {
      prevItems: items,
      fakeKeys: {},
      configurator,
      map,
    };
  }, []);

  scope.configurator = configurator;

  useMemo(() => {
    if (items === scope.prevItems) return;
    const { prevItems, map, fakeKeys } = scope;
    const configurator = (idx: number) => scope.configurator(idx);
    const ctrls = items.map(item => createController<T, I>(state, item, getKey, map));
    const { enters, leaves } = diff(prevItems, items, getKey);

    state.setCtrls(ctrls);
    prepare(ctrls, configurator);

    for (const key of Object.keys(fakeKeys)) {
      const ctrl = scope.map.get(key);
      const idx = ctrl.getIdx();
      const { leave } = configurator(idx);

      ctrl.start(() => ({ to: leave }));
    }

    for (const key of Object.keys(enters)) {
      const idx = enters[key];
      const { from, enter, config } = configurator(idx);
      const ctrl = map.get(key);
      const item = ctrl.getItem();
      const isPlaying = state.detectIsPlaying(key);
      let ctrl$ = ctrl;

      if (isPlaying) {
        const ctrl = new Controller<T, I>(state);

        ctrl.markAsFake(key);
        ctrl.setIdx(idx);
        ctrl.setItem(item);
        ctrl.setFrom(from);
        ctrl.setTo(enter);
        ctrl.setSpringConfigFn(config);
        ctrl.setConfigurator(configurator);
        state.addCtrl(ctrl);

        const fakeKey = ctrl.getKey();

        fakeKeys[fakeKey] = true;
        map.set(fakeKey, ctrl);
        ctrl$ = ctrl;
      }

      ctrl$.start(() => ({ to: enter, value: { ...from } }));
    }

    for (const key of Object.keys(leaves)) {
      const idx = leaves[key];
      const { leave } = configurator(idx);
      const ctrl = map.get(key);

      ctrl.start(() => ({ to: leave }));
    }

    scope.prevItems = items;
  }, [items]);

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

function createController<T extends string, I = unknown>(
  state: SharedState<T>,
  item: I,
  getKey: (x: I) => Key,
  map: Map<Key, Controller<T, I>>,
) {
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

  return ctrl;
}

function prepare<T extends string>(
  ctrls: Array<Controller<T>>,
  configurator: (idx: number) => TransitionItemOptions<T>,
) {
  ctrls.forEach((ctrl, idx) => {
    const { from, enter, config } = configurator(idx);

    ctrl.setIdx(idx);
    ctrl.setFrom(from);
    ctrl.setTo(enter);
    ctrl.setSpringConfigFn(config);
    ctrl.setConfigurator(configurator);
  });
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
  prevItems: Array<I>;
  fakeKeys: Record<Key, boolean>;
  configurator: (idx: number) => TransitionItemOptions<T>;
  map: Map<Key, Controller<T, I>>;
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
