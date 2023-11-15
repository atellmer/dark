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
import { type AnimationEventValue, SharedState } from '../shared-state';
import { type BaseItemConfig, type ConfiguratorFn, Controller } from '../controller';
import { type SpringApi } from '../use-springs';

export type TransitionItemConfig<T extends string, I = unknown> = {
  from: (x: I) => SpringValue<T>;
  enter: (x: I) => SpringValue<T>;
  leave?: (x: I) => SpringValue<T>;
  update?: (x: I) => SpringValue<T>;
  trail?: number;
} & Pick<BaseItemConfig<T>, 'config' | 'immediate'>;

function useTransition<T extends string, I = unknown>(
  items: Array<I>,
  getKey: (x: I) => Key,
  configurator: (idx: number) => TransitionItemConfig<T, I>,
): [TransitionFn<T, I>, TransitionApi<T>] {
  const forceUpdate = useUpdate();
  const update = () => batch(forceUpdate);
  const state = useMemo(() => new SharedState<T>(), []);
  const scope = useMemo<Scope<T, I>>(
    () => ({ ctrlsMap: new Map(), itemsMap: new Map(), fakesMap: new Map(), configurator, items }),
    [],
  );

  scope.configurator = configurator;

  const transition = useMemo(() => {
    const configurator = (idx: number) => scope.configurator(idx);
    const { ctrlsMap, fakesMap, items: prevItems } = scope;
    const { ctrls, itemsMap } = data({ items, getKey, configurator, state, ctrlsMap });
    const { insertionsMap, removesMap, movesMap, stableMap } = diff(prevItems, items, getKey);

    state.setCtrls(ctrls);

    startLoop({ destKey: 'leave', space: fakesMap, state, scope }); // !
    startLoop({ destKey: 'enter', space: insertionsMap, state, scope });
    startLoop({ destKey: 'leave', space: removesMap, state, scope });
    startLoop({ destKey: 'update', space: movesMap, state, scope });
    startLoop({ destKey: 'update', space: stableMap, state, scope });

    scope.items = items; // !
    scope.itemsMap = itemsMap;

    const transition: TransitionFn<T, I> = (render: TransitionRenderFn<T, I>) => {
      const elements: Array<TransitionElement> = [];

      for (const [key, ctrl] of ctrlsMap) {
        const item = ctrl.getItem();
        const idx = ctrl.getIdx();
        const spring: TransitionItem<T, I> = {
          ctrl,
          item,
          getValue: () => ctrl.getValue(),
          detectIsSeriesPlaying: () => state.detectIsPlaying(),
        };

        elements.splice(idx, 0, Fragment({ key, slot: render({ spring, item, idx }) }));
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

    unmounts.push(
      api.on('item-end', e => handleItemEnd(e, scope)),
      api.on('series-end', () => handleSeriesEnd(update, state, scope)),
    );

    return () => unmounts.forEach(x => x());
  }, []);

  useLayoutEffect(() => () => api.cancel(), []);

  return [transition, api];
}

type DataOptions<T extends string, I = unknown> = {
  items: Array<I>;
  getKey: (x: I) => Key;
  state: SharedState<T>;
} & Pick<Scope<T, I>, 'configurator' | 'ctrlsMap'>;

function data<T extends string, I = unknown>(options: DataOptions<T, I>) {
  const { items, getKey, configurator, state, ctrlsMap } = options;
  const itemsMap = new Map<Key, I>();
  const ctrls = items.map((item, idx) => {
    const key = getKey(item);

    itemsMap.set(key, item);

    return getController<T, I>({ idx, item, getKey, configurator, state, ctrlsMap });
  });

  return { ctrls, itemsMap };
}

type GetControllerOptions<T extends string, I = unknown> = {
  idx: number;
  item: I;
} & Pick<DataOptions<T, I>, 'getKey' | 'configurator' | 'state' | 'ctrlsMap'>;

function getController<T extends string, I = unknown>(options: GetControllerOptions<T, I>) {
  const { idx, item, getKey, configurator, state, ctrlsMap } = options;
  const key = getKey(item);
  const ctrl = ctrlsMap.get(key) || new Controller<T, I>(state);

  prepare({ ctrl, key, idx, item, configurator });
  ctrlsMap.set(key, ctrl);

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

      if (!prevKeysMap[prevKey]) {
        prevKeysMap[prevKey] = true;
        prevKeys.push(prevKey);
      }
    }

    if (nextItem) {
      const nextKey = getKey(nextItem);

      if (!nextKeysMap[nextKey]) {
        nextKeysMap[nextKey] = true;
        nextKeys.push(nextKey);
      }
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
  const insertionsMap = new Map<Key, number>();
  const removesMap = new Map<Key, number>();
  const movesMap = new Map<Key, number>();
  const stableMap = new Map<Key, number>();

  for (let i = 0; i < size; i++) {
    const nextKey = nextKeys[i - n] ?? null;
    const prevKey = prevKeys[i - p] ?? null;

    if (nextKey !== prevKey) {
      if (nextKey !== null && !prevKeysMap[nextKey]) {
        if (prevKey !== null && !nextKeysMap[prevKey]) {
          insertionsMap.set(nextKey, i);
          removesMap.set(prevKey, i);
        } else {
          insertionsMap.set(nextKey, i);
          p++;
          size++;
        }
      } else if (!nextKeysMap[prevKey]) {
        removesMap.set(prevKey, i);
        n++;
        size++;
      } else if (nextKeysMap[prevKey] && nextKeysMap[nextKey]) {
        movesMap.set(nextKey, i);
      }
    } else if (nextKey !== null) {
      stableMap.set(nextKey, i);
    }
  }

  return {
    insertionsMap,
    removesMap,
    movesMap,
    stableMap,
  };
}

type StartLoopOptions<T extends string, I = unknown> = {
  destKey: DestinationKey<T>;
  space: Map<Key, number>;
  state: SharedState<T>;
  scope: Scope<T, I>;
};

function startLoop<T extends string, I = unknown>(options: StartLoopOptions<T, I>) {
  const { space, destKey, state, scope } = options;
  const { configurator, ctrlsMap, fakesMap } = scope;
  const ctrls = state.getCtrls();
  let idx$ = 0;

  if (destKey === 'enter') {
    for (const [key, idx] of space) {
      const { enter } = configurator(idx);
      const ctrl = ctrlsMap.get(key);
      const item = ctrl.getItem();
      const isPlaying = state.detectIsPlaying(key);
      const fn = () => ({ to: enter(item) });

      if (isPlaying) {
        const fake = new Controller<T, I>(state);
        const fakeKey = fake.markAsFake(key);

        prepare({ ctrl: fake, key: fakeKey, idx, item, configurator });
        ctrlsMap.set(fakeKey, fake);
        fakesMap.set(fakeKey, idx);
        ctrls.push(fake);
        fake.start(fn);
      } else {
        ctrl.start(fn);
      }
    }
  } else {
    for (const [key, idx] of space) {
      const config = configurator(idx);
      const { trail } = config;
      const dest = config[destKey];
      const ctrl = ctrlsMap.get(key);
      const item = ctrl.getItem();
      const fn = () => ({ to: dest(item) });

      if (dest) {
        if (destKey === 'update') {
          withTrail(trail, idx$, () => ctrl.start(fn)); // !
        } else {
          ctrl.start(fn);
        }
      }

      idx$++;
    }
  }
}

function withTrail(trail: number, idx: number, fn: () => void) {
  if (trail) {
    setTimeout(() => fn(), idx * trail);
  } else {
    fn();
  }
}

type PrepareOptions<T extends string, I = unknown> = {
  ctrl: Controller<T, I>;
  idx: number;
  key: Key;
  item: I;
  configurator: (idx: number) => TransitionItemConfig<T>;
};

function prepare<T extends string, I = unknown>(options: PrepareOptions<T, I>) {
  const { ctrl, key, idx, item, configurator } = options;
  const { from, enter, config } = configurator(idx);
  const configurator$: ConfiguratorFn<T> = (idx: number) => {
    const { from, enter, leave, update, trail, ...rest } = configurator(idx);

    return { from: from(item), ...rest };
  };

  ctrl.setKey(key);
  ctrl.setIdx(idx);
  ctrl.setItem(item);
  ctrl.setFrom(from(item));
  ctrl.setTo(enter(item));
  ctrl.setSpringConfigFn(config);
  ctrl.setConfigurator(configurator$);
}

function handleItemEnd<T extends string, I = unknown>({ key }: AnimationEventValue<T>, scope: Scope<T, I>) {
  const { ctrlsMap, fakesMap, itemsMap } = scope;
  const ctrl = ctrlsMap.get(key);

  if (ctrl.detectIsFake()) {
    ctrlsMap.delete(key);
    fakesMap.delete(key);
  } else if (!itemsMap.has(key)) {
    ctrlsMap.delete(key);
  }
}

function handleSeriesEnd<T extends string, I = unknown>(update: () => void, state: SharedState<T>, scope: Scope<T, I>) {
  const { ctrlsMap, configurator } = scope;
  const ctrls: Array<Controller<T, I>> = [];

  for (const [_, ctrl] of ctrlsMap) {
    const { enter } = configurator(ctrl.getIdx());

    ctrl.replaceValue({ ...enter(ctrl.getItem()) });
    ctrl.notify();
    ctrls.push(ctrl);
  }

  state.setCtrls(ctrls);
  update();
}

type Scope<T extends string, I = unknown> = {
  items: Array<I>;
  configurator: (idx: number) => TransitionItemConfig<T>;
  ctrlsMap: Map<Key, Controller<T, I>>;
  itemsMap: Map<Key, I>;
  fakesMap: Map<Key, number>;
};

type DestinationKey<T extends string> = keyof Pick<TransitionItemConfig<T>, 'leave' | 'update' | 'enter'>;

type TransitionElement = Component | TagVirtualNodeFactory;

export type TransitionApi<T extends string = string> = {} & Pick<
  SpringApi<T>,
  'start' | 'cancel' | 'pause' | 'resume' | 'on' | 'once'
>;

export type TransitionItem<T extends string = string, I = unknown> = {
  item: I;
} & SpringItem<T>;

export type TransitionRenderFn<T extends string = string, I = unknown> = (options: {
  spring: TransitionItem<T, I>;
  item: I;
  idx: number;
}) => TransitionElement;

export type TransitionFn<T extends string = string, I = unknown> = (
  render: TransitionRenderFn<T, I>,
) => Array<TransitionElement>;

export { useTransition };
