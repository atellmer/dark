import {
  type Component,
  type TagVirtualNodeFactory,
  Fragment,
  batch,
  useMemo,
  useUpdate,
  useLayoutEffect,
} from '@dark-engine/core';

import { type Key, type SpringValue, type SpringItem } from '../shared';
import {
  type AnimationEventName,
  type AnimationEventHandler,
  type AnimationEventValue,
  SharedState,
} from '../shared-state';
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
): [TransitionFn<T, I>, TransitionApi<T>] {
  const forceUpdate = useUpdate();
  const update = () => batch(forceUpdate);
  const state = useMemo(() => new SharedState<T>(), []);
  const scope = useMemo<Scope<T, I>>(
    () => ({ fakes: {}, record: {}, enters: {}, leaves: {}, map: new Map(), configurator, items }),
    [],
  );

  scope.configurator = configurator;

  const transition = useMemo(() => {
    const configurator = (idx: number) => scope.configurator(idx);
    const { map, fakes, items: prevItems } = scope;
    const { ctrls, record } = data({ items, getKey, configurator, state, map });
    const { enters, leaves, updates } = diff(prevItems, items, getKey);

    state.setCtrls(ctrls);

    startLoop({ destKey: 'leave', space: fakes, state, scope }); // !
    startLoop({ destKey: 'enter', space: enters, state, scope });
    startLoop({ destKey: 'leave', space: leaves, state, scope });
    startLoop({ destKey: 'update', space: updates, state, scope });

    scope.items = items; // !
    scope.record = record;

    const transition: TransitionFn<T, I> = (render: TransitionRenderFn<T, I>) => {
      const elements: Array<Element> = [];

      for (const [key, ctrl] of map) {
        const item = ctrl.getItem();
        const idx = ctrl.getIdx();
        const spring: TransitionItem<T, I> = {
          ctrl,
          item,
          getValue: () => ctrl.getValue(),
          detectIsActive: () => state.detectIsPlaying(),
        };

        elements.push(Fragment({ key, slot: render({ spring, idx }) }));
      }

      return elements;
    };

    return transition;
  }, [items]);

  const api = useMemo<TransitionApi<T>>(() => {
    return {
      start: state.start.bind(state),
      cancel: state.cancel.bind(state),
      pause: state.pause.bind(state),
      resume: state.resume.bind(state),
      on: state.on.bind(state),
      once: state.once.bind(state),
    };
  }, []);

  useLayoutEffect(() => {
    const unmounts: Array<() => void> = [];
    const off1 = api.on('item-end', e => handleItemEnd(e, scope));
    const off2 = api.on('series-end', () => handleSeriesEnd(update, scope));

    unmounts.push(off1, off2);

    return () => unmounts.forEach(x => x());
  }, []);

  useLayoutEffect(() => () => api.cancel(), []);

  return [transition, api];
}

type DataOptions<T extends string, I = unknown> = {
  items: Array<I>;
  getKey: (x: I) => Key;
  state: SharedState<T>;
} & Pick<Scope<T, I>, 'configurator' | 'map'>;

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

type StartLoopOptions<T extends string, I = unknown> = {
  destKey: DestKey<T>;
  space: Record<Key, number>;
  state: SharedState<T>;
  scope: Scope<T, I>;
};

function startLoop<T extends string, I = unknown>(options: StartLoopOptions<T, I>) {
  const { space, destKey, state, scope } = options;
  const { configurator, map, fakes } = scope;

  if (destKey === 'enter') {
    for (const key of Object.keys(space)) {
      const idx = space[key];
      const { from, enter, config } = configurator(idx);
      const ctrl = map.get(key);
      const item = ctrl.getItem();
      const isPlaying = state.detectIsPlaying(key);
      const fn = () => ({ to: enter });

      if (isPlaying) {
        const fake = new Controller<T, I>(state);
        const fakeKey = fake.markAsFake(key);

        fakes[fakeKey] = idx;
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
  } else {
    for (const key of Object.keys(space)) {
      const to = configurator(space[key])[destKey];
      const ctrl = map.get(key);

      to && ctrl.start(() => ({ to })); // !
    }
  }
}

function handleItemEnd<T extends string, I = unknown>({ key }: AnimationEventValue<T>, scope: Scope<T, I>) {
  const { map, fakes, record } = scope;
  const ctrl = map.get(key);

  if (ctrl.detectIsFake()) {
    map.delete(key);
    delete fakes[key];
  } else if (!record[key]) {
    map.delete(key);
  }
}

function handleSeriesEnd<T extends string, I = unknown>(update: () => void, scope: Scope<T, I>) {
  const { map, configurator } = scope;

  for (const [_, ctrl] of map) {
    const { enter } = configurator(ctrl.getIdx());

    ctrl.replaceValue({ ...enter });
    ctrl.notify();
  }

  update();
}

type Scope<T extends string, I = unknown> = {
  items: Array<I>;
  configurator: (idx: number) => TransitionItemOptions<T>;
  map: Map<Key, Controller<T, I>>;
  record: Record<Key, I>;
  fakes: Record<Key, number>;
};

type DestKey<T extends string> = keyof Pick<TransitionItemOptions<T>, 'leave' | 'update' | 'enter'>;

export type TransitionApi<T extends string = string> = {
  start: (fn?: StartFn<T>) => void;
  cancel: () => void;
  pause: () => void;
  resume: () => void;
  on: (event: AnimationEventName, handler: AnimationEventHandler<T>) => () => void;
  once: (event: AnimationEventName, handler: AnimationEventHandler<T>) => () => void;
};

export type TransitionItem<T extends string = string, I = unknown> = {
  item: I;
} & SpringItem<T>;

type Element = Component | TagVirtualNodeFactory;

export type TransitionRenderFn<T extends string = string, I = unknown> = (options: {
  spring: TransitionItem<T, I>;
  idx: number;
}) => Element;

export type TransitionFn<T extends string = string, I = unknown> = (render: TransitionRenderFn<T, I>) => Array<Element>;

export { useTransition };
