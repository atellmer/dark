import {
  type Component,
  type TagVirtualNodeFactory,
  type Callback,
  Fragment,
  batch,
  useMemo,
  useUpdate,
  useEffect,
  useLayoutEffect,
  detectIsArray,
  detectIsNumber,
} from '@dark-engine/core';

import { type Key, type SpringValue } from '../shared';
import { type AnimationEventValue, SharedState } from '../state';
import { type BaseItemConfig, type ConfiguratorFn, Controller } from '../controller';
import { type SpringApi } from '../use-springs';
import { type Spring } from '../spring';
import { uniq } from '../utils';

export type TransitionItemConfig<T extends string> = {
  from: SpringValue<T>;
  enter: SpringValue<T>;
  leave?: SpringValue<T>;
  update?: SpringValue<T>;
  trail?: number;
} & Pick<BaseItemConfig<T>, 'config' | 'immediate'>;

function useTransition<T extends string, I = unknown>(
  items: Array<I>,
  getKey: (x: I) => Key,
  configurator: TransitionConfiguratorFn<T, I>,
): [TransitionFn<T, I>, TransitionApi<T>] {
  const forceUpdate = useUpdate();
  const update = () => batch(forceUpdate);
  const state = useMemo(() => new SharedState<T>(), []);
  const scope = useMemo<Scope<T, I>>(
    () => ({
      ctrlsMap: new Map(),
      itemsMap: new Map(),
      fakesMap: new Map(),
      fromItems: true,
      inChain: false,
      items: [],
      pending: null,
      configurator,
    }),
    [],
  );

  scope.configurator = configurator;

  const transition = useMemo<TransitionFn<T, I>>(
    () => (render: TransitionRenderFn<T, I>) => {
      const { ctrlsMap } = scope;
      const elements: Array<TransitionElement> = [];

      for (const [key, ctrl] of ctrlsMap) {
        const idx = ctrl.getIdx();
        const item = ctrl.getItem();
        const spring = ctrl.getSpring();
        const element = Fragment({ key, slot: render({ spring, item, idx }) });

        if (elements[idx]) {
          const sibling = elements[idx];

          if (detectIsArray(sibling)) {
            sibling.push(element);
          } else {
            elements[idx] = [sibling, element] as unknown as TransitionElement;
          }
        } else {
          elements[idx] = element;
        }
      }

      return Fragment({ slot: elements });
    },
    [],
  );

  const api = useMemo<TransitionApi<T>>(() => {
    return {
      start: fn => {
        scope.fromItems = false;

        if (scope.inChain) {
          scope.pending && scope.pending();
          scope.pending = null;
        } else {
          state.start(fn);
        }
      },
      chain: (value: boolean) => (scope.inChain = value),
      delay: state.delay.bind(state),
      cancel: state.cancel.bind(state),
      pause: state.pause.bind(state),
      resume: state.resume.bind(state),
      on: state.on.bind(state),
      isCanceled: state.getIsCanceled.bind(state),
    };
  }, []);

  useEffect(() => {
    const { inChain } = scope;
    const nextItems = uniq(items, getKey);
    const loop = (items: Array<I>) => {
      const { ctrlsMap, fakesMap, items: $items } = scope;
      const configurator: TransitionConfiguratorFn<T, I> = (idx, item) => scope.configurator(idx, item);
      const { ctrls, itemsMap } = data({ items, getKey, configurator, state, ctrlsMap });
      const { hasChanges, insMap, remMap, movMap, stabMap, replaced } = diff($items, items, getKey);

      state.setCtrls(ctrls);
      replaced.forEach(key => ctrlsMap.get(key).setIsReplaced(true));

      state.event('series-start');
      startLoop({ action: Action.LEAVE, space: fakesMap, state, scope }); // !
      startLoop({ action: Action.ENTER, space: insMap, state, scope });
      startLoop({ action: Action.LEAVE, space: remMap, state, scope });
      startLoop({ action: Action.UPDATE, space: movMap, state, scope });
      startLoop({ action: Action.UPDATE, space: stabMap, state, scope });

      scope.items = items; // !
      scope.itemsMap = itemsMap;
      scope.fromItems = true;
      hasChanges && forceUpdate(); //!
    };

    if (inChain) {
      scope.pending = () => state.defer(() => loop(nextItems));
    } else {
      loop(nextItems);
    }
  }, [items]);

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
  let hasChanges = false;
  const insMap = new Map<Key, number>();
  const remMap = new Map<Key, number>();
  const movMap = new Map<Key, number>();
  const stabMap = new Map<Key, number>();
  const replaced = new Set<Key>();

  for (let i = 0; i < size; i++) {
    const nextKey = nextKeys[i - n] ?? null;
    const prevKey = prevKeys[i - p] ?? null;

    if (nextKey !== prevKey) {
      if (nextKey !== null && !prevKeysMap[nextKey]) {
        if (prevKey !== null && !nextKeysMap[prevKey]) {
          insMap.set(nextKey, i);
          remMap.set(prevKey, i);
          replaced.add(prevKey);
          hasChanges = true;
        } else {
          insMap.set(nextKey, i);
          hasChanges = true;
          p++;
          size++;
        }
      } else if (!nextKeysMap[prevKey]) {
        remMap.set(prevKey, i);
        hasChanges = true;
        n++;
        size++;
      } else if (nextKeysMap[prevKey] && nextKeysMap[nextKey]) {
        movMap.set(nextKey, i);
        hasChanges = true;
      }
    } else if (nextKey !== null) {
      stabMap.set(nextKey, i);
    }
  }

  return {
    hasChanges,
    insMap,
    remMap,
    movMap,
    stabMap,
    replaced,
  };
}

type StartLoopOptions<T extends string, I = unknown> = {
  action: Action;
  space: Map<Key, number>;
  state: SharedState<T>;
  scope: Scope<T, I>;
};

function startLoop<T extends string, I = unknown>(options: StartLoopOptions<T, I>) {
  const { space, action, state, scope } = options;
  const { configurator, ctrlsMap, fakesMap } = scope;
  const ctrls = state.getCtrls();
  const isEnter = action === Action.ENTER;
  const isLeave = action === Action.LEAVE;
  let idx$ = 0;

  for (const [key, idx] of space) {
    const ctrl = ctrlsMap.get(key);
    const item = ctrl.getItem();
    const config = configurator(idx, item);
    const { trail } = config;
    const to = isLeave && !config[action] ? config.from : config[action];
    let ctrl$ = ctrl;

    if (isEnter) {
      const isReplaced = ctrl.getIsReplaced();
      const isPlaying = state.detectIsPlaying(key);

      if (isReplaced) {
        if (isPlaying) {
          const fake = new Controller<T, I>(state);
          const fakeKey = fake.markAsFake(key);

          ctrl$ = fake;
          prepare({ ctrl: fake, key: fakeKey, idx, item, configurator });
          ctrlsMap.set(fakeKey, fake);
          fakesMap.set(fakeKey, idx);
          ctrls.push(fake);
        } else {
          ctrl.setIsReplaced(false);
        }
      }
    }

    to && withTrail(() => ctrl$.start(() => ({ to })), idx$, trail);
    idx$++;
  }
}

function withTrail(fn: () => void, idx: number, trail?: number) {
  if (detectIsNumber(trail)) {
    setTimeout(fn, idx * trail);
  } else {
    fn();
  }
}

type PrepareOptions<T extends string, I = unknown> = {
  ctrl: Controller<T, I>;
  idx: number;
  key: Key;
  item: I;
  configurator: TransitionConfiguratorFn<T, I>;
};

function prepare<T extends string, I = unknown>(options: PrepareOptions<T, I>) {
  const { ctrl, key, idx, item, configurator } = options;
  const { from, enter, config } = configurator(idx, item);
  const configurator$: ConfiguratorFn<T> = (idx: number) => {
    const { enter, leave, update, trail, ...rest } = configurator(idx, item);

    return { ...rest };
  };

  ctrl.setKey(key);
  ctrl.setIdx(idx);
  ctrl.setItem(item);
  ctrl.setFrom(from);
  ctrl.setTo(enter);
  ctrl.setSpringConfigFn(config);
  ctrl.setConfigurator(configurator$);
}

function handleItemEnd<T extends string, I = unknown>({ key }: AnimationEventValue<T>, scope: Scope<T, I>) {
  const { ctrlsMap, fakesMap, itemsMap } = scope;

  if (ctrlsMap.has(key) && ctrlsMap.get(key).detectIsFake()) {
    ctrlsMap.delete(key);
    fakesMap.delete(key);
  }

  !itemsMap.has(key) && ctrlsMap.delete(key);
}

function handleSeriesEnd<T extends string, I = unknown>(update: () => void, state: SharedState<T>, scope: Scope<T, I>) {
  const { ctrlsMap, configurator, fromItems } = scope;
  const ctrls: Array<Controller<T, I>> = [];

  if (!fromItems) return;

  for (const [_, ctrl] of ctrlsMap) {
    const { enter } = configurator(ctrl.getIdx(), ctrl.getItem());

    ctrl.replaceValue({ ...enter });
    ctrl.notify();
    ctrls.push(ctrl);
  }

  state.setCtrls(ctrls);
  update();
}

type Scope<T extends string, I = unknown> = {
  items: Array<I>;
  configurator: TransitionConfiguratorFn<T, I>;
  ctrlsMap: Map<Key, Controller<T, I>>;
  itemsMap: Map<Key, I>;
  fakesMap: Map<Key, number>;
  fromItems: boolean;
  inChain: boolean;
  pending: Callback;
};

enum Action {
  ENTER = 'enter',
  LEAVE = 'leave',
  UPDATE = 'update',
}

type TransitionElement = Component | TagVirtualNodeFactory;

type TransitionConfiguratorFn<T extends string = string, I = unknown> = (
  idx: number,
  item: I,
) => TransitionItemConfig<T>;

export type TransitionApi<T extends string = string> = Omit<SpringApi<T>, 'reset'>;

export type TransitionRenderFn<T extends string = string, I = unknown> = (options: {
  spring: Spring<T>;
  item: I;
  idx: number;
}) => TransitionElement;

export type TransitionFn<T extends string = string, I = unknown> = (render: TransitionRenderFn<T, I>) => Component;

export { useTransition };
