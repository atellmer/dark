import {
  type Component,
  type TagVirtualNodeFactory,
  type Callback,
  type ElementKey,
  Fragment,
  useMemo,
  useUpdate,
  useLayoutEffect,
  detectIsArray,
  detectIsNumber,
  startTransition,
  scheduler,
  flatten,
} from '@dark-engine/core';

import { type BaseItemConfig, type ConfiguratorFn, Controller } from '../controller';
import { type AnimationEventValue, SharedState } from '../state';
import { type SpringApi } from '../use-springs';
import { type SpringValue } from '../shared';
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
  getKey: KeyExtractor<I>,
  configurator: TransitionConfiguratorFn<T, I>,
): [TransitionFn<T, I>, TransitionApi<T>] {
  const forceUpdate = useUpdate();
  const update = () => (scope.isNonBlocking ? startTransition(forceUpdate) : forceUpdate());
  const state = useMemo(() => new SharedState<T>(), []);
  const scope = useMemo<Scope<T, I>>(
    () => ({
      transitions: [],
      ctrlsMap: new Map(),
      itemsMap: new Map(),
      fakesMap: new Map(),
      items: [],
      queue: [],
      hasReplaces: false,
      fromApi: false,
      inChain: false,
      isNonBlocking: false,
      pending: null,
      configurator,
    }),
    [],
  );

  scope.configurator = configurator;
  scope.isNonBlocking = scheduler.detectIsTransition();

  useMemo(() => {
    const make = (items: Array<I>) => {
      const { transitions, ctrlsMap, fakesMap, items: $items } = scope;
      const configurator: TransitionConfiguratorFn<T, I> = (idx, item) => scope.configurator(idx, item);
      const { ctrls, itemsMap } = setup({ items, getKey, configurator, state, ctrlsMap });
      const { insMap, remMap, movMap, stabMap, replaced } = diff($items, items, getKey);

      scope.hasReplaces = replaced.size > 0;
      state.setCtrls(ctrls);
      replaced.forEach(key => ctrlsMap.get(key).setIsReplaced(true));

      transitions.push(
        ...animate({ action: Action.LEAVE, space: fakesMap, state, scope }), // !
        ...animate({ action: Action.ENTER, space: insMap, state, scope }),
        ...animate({ action: Action.LEAVE, space: remMap, state, scope }),
        ...animate({ action: Action.UPDATE, space: movMap, state, scope }),
        ...animate({ action: Action.UPDATE, space: stabMap, state, scope }),
      );

      state.setHasTransitions(transitions.length > 0);
      scope.items = items; // !
      scope.itemsMap = itemsMap;
      scope.fromApi = false;
    };

    make(uniq(items, getKey));
  }, [items]);

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

      return Fragment({ slot: flatten(elements) });
    },
    [],
  );

  const api = useMemo<TransitionApi<T>>(() => {
    return {
      marker: 'transition-api',
      start: fn => {
        scope.fromApi = true;

        if (scope.inChain) {
          scope.pending && scope.pending();
          scope.pending = null;
          update();
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

  useLayoutEffect(() => {
    if (scope.transitions.length === 0) return;
    const { inChain } = scope;
    const start = () => {
      state.event('series-start');
      scope.transitions.forEach(x => x.fn());
      scope.transitions = [];
      state.setHasTransitions(false);
    };

    if (inChain) {
      scope.pending = () => state.defer(start);
    } else {
      start();
    }
  }); // !

  useLayoutEffect(() => {
    const offs: Array<Callback> = [
      api.on('item-end', e => handleItemEnd(e, scope)),
      api.on('series-end', () => handleSeriesEnd(update, state, scope)),
    ];

    return () => {
      offs.forEach(x => x());
      api.cancel();
    };
  }, []);

  return [transition, api];
}

type SetupOptions<T extends string, I = unknown> = {
  items: Array<I>;
  getKey: KeyExtractor<I>;
  state: SharedState<T>;
} & Pick<Scope<T, I>, 'configurator' | 'ctrlsMap'>;

function setup<T extends string, I = unknown>(options: SetupOptions<T, I>) {
  const { items, getKey, configurator, state, ctrlsMap } = options;
  const itemsMap = new Map<ElementKey, I>();
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
} & Pick<SetupOptions<T, I>, 'getKey' | 'configurator' | 'state' | 'ctrlsMap'>;

function getController<T extends string, I = unknown>(options: GetControllerOptions<T, I>) {
  const { idx, item, getKey, configurator, state, ctrlsMap } = options;
  const key = getKey(item);
  const ctrl = ctrlsMap.get(key) || new Controller<T, I>(state);

  prepare({ ctrl, key, idx, item, configurator });
  ctrlsMap.set(key, ctrl);

  return ctrl;
}

function extractKeys<I = unknown>(prevItems: Array<I>, nextItems: Array<I>, getKey: KeyExtractor<I>) {
  const prevKeys: Array<ElementKey> = [];
  const nextKeys: Array<ElementKey> = [];
  const prevKeysMap: Record<ElementKey, boolean> = {};
  const nextKeysMap: Record<ElementKey, boolean> = {};
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

function diff<I = unknown>(prevItems: Array<I>, nextItems: Array<I>, getKey: KeyExtractor<I>) {
  const { prevKeys, nextKeys, prevKeysMap, nextKeysMap } = extractKeys(prevItems, nextItems, getKey);
  let size = Math.max(prevKeys.length, nextKeys.length);
  let p = 0;
  let n = 0;
  const insMap = new Map<ElementKey, number>();
  const remMap = new Map<ElementKey, number>();
  const movMap = new Map<ElementKey, number>();
  const stabMap = new Map<ElementKey, number>();
  const replaced = new Set<ElementKey>();

  for (let i = 0; i < size; i++) {
    const nextKey = nextKeys[i - n] ?? null;
    const prevKey = prevKeys[i - p] ?? null;

    if (nextKey !== prevKey) {
      if (nextKey !== null && !prevKeysMap[nextKey]) {
        if (prevKey !== null && !nextKeysMap[prevKey]) {
          insMap.set(nextKey, i);
          remMap.set(prevKey, i);
          replaced.add(prevKey);
        } else {
          insMap.set(nextKey, i);
          p++;
          size++;
        }
      } else if (!nextKeysMap[prevKey]) {
        remMap.set(prevKey, i);
        n++;
        size++;
      } else if (nextKeysMap[prevKey] && nextKeysMap[nextKey]) {
        movMap.set(nextKey, i);
      }
    } else if (nextKey !== null) {
      stabMap.set(nextKey, i);
    }
  }

  return {
    insMap,
    remMap,
    movMap,
    stabMap,
    replaced,
  };
}

type AnimateOptions<T extends string, I = unknown> = {
  action: Action;
  space: Map<ElementKey, number>;
  state: SharedState<T>;
  scope: Scope<T, I>;
};

function animate<T extends string, I = unknown>(options: AnimateOptions<T, I>) {
  const transitions: Array<Transition> = [];
  const { space, action, state, scope } = options;
  const { configurator, ctrlsMap, fakesMap } = scope;
  const ctrls = state.getCtrls();
  const isEnter = action === Action.ENTER;
  const isLeave = action === Action.LEAVE;
  let $idx = 0;

  for (const [key, idx] of space) {
    const ctrl = ctrlsMap.get(key);
    const item = ctrl.getItem();
    const config = configurator(idx, item);
    const { trail } = config;
    const to = isLeave && !config[action] ? config.from : config[action];
    let $ctrl = ctrl;
    let $key = key;

    if (isEnter) {
      const isReplaced = ctrl.getIsReplaced();
      const isPlaying = state.detectIsPlaying(key);

      if (isReplaced) {
        if (isPlaying) {
          const fake = new Controller<T, I>(state);
          const fakeKey = fake.markAsFake(key);

          $ctrl = fake;
          $key = fakeKey;
          prepare({ ctrl: fake, key: fakeKey, idx, item, configurator });
          ctrlsMap.set(fakeKey, fake);
          fakesMap.set(fakeKey, idx);
          ctrls.push(fake);
        } else {
          ctrl.setIsReplaced(false);
        }
      }
    }

    const start = () => $ctrl.start(() => ({ to }));
    const fn = to && withTrail(start, $idx, $ctrl, trail);

    fn && transitions.push(new Transition($key, fn));
    $idx++;
  }

  return transitions;
}

function withTrail<T extends string, I = unknown>(
  start: () => void,
  idx: number,
  ctrl: Controller<T, I>,
  trail?: number,
) {
  if (detectIsNumber(trail)) {
    ctrl.setIsPlaying(true);
    return () => setTimeout(start, idx * trail);
  }

  return start;
}

type PrepareOptions<T extends string, I = unknown> = {
  ctrl: Controller<T, I>;
  idx: number;
  key: ElementKey;
  item: I;
  configurator: TransitionConfiguratorFn<T, I>;
};

function prepare<T extends string, I = unknown>(options: PrepareOptions<T, I>) {
  const { ctrl, key, idx, item, configurator } = options;
  const { from, enter, config } = configurator(idx, item);
  const $configurator: ConfiguratorFn<T> = (idx: number) => {
    const { enter, leave, update, trail, ...rest } = configurator(idx, item);

    return { ...rest };
  };

  ctrl.setKey(key);
  ctrl.setIdx(idx);
  ctrl.setItem(item);
  ctrl.setFrom(from);
  ctrl.setTo(enter);
  ctrl.setSpringConfigFn(config);
  ctrl.setConfigurator($configurator);
}

function handleItemEnd<T extends string, I = unknown>({ key }: AnimationEventValue<T>, scope: Scope<T, I>) {
  const { ctrlsMap, fakesMap, itemsMap, hasReplaces, queue, fromApi } = scope;

  if (ctrlsMap.has(key) && ctrlsMap.get(key).detectIsFake()) {
    ctrlsMap.delete(key);
    fakesMap.delete(key);
  }

  if (fromApi || hasReplaces) {
    !itemsMap.has(key) && ctrlsMap.delete(key);
  } else {
    queue.push(() => !scope.itemsMap.has(key) && ctrlsMap.delete(key));
  }
}

function handleSeriesEnd<T extends string, I = unknown>(update: () => void, state: SharedState<T>, scope: Scope<T, I>) {
  const { ctrlsMap, configurator, fromApi } = scope;
  const ctrls: Array<Controller<T, I>> = [];

  if (fromApi) return;
  scope.queue.forEach(x => x());
  scope.queue = [];

  for (const [_, ctrl] of ctrlsMap) {
    const { enter } = configurator(ctrl.getIdx(), ctrl.getItem());

    ctrl.replaceValue({ ...enter });
    ctrl.notify(true);
    ctrls.push(ctrl);
  }

  state.setCtrls(ctrls);
  update();
}

class Transition {
  constructor(public key: ElementKey, public fn: Callback) {}
}

type Scope<T extends string, I = unknown> = {
  transitions: Array<Transition>;
  items: Array<I>;
  configurator: TransitionConfiguratorFn<T, I>;
  ctrlsMap: Map<ElementKey, Controller<T, I>>;
  itemsMap: Map<ElementKey, I>;
  fakesMap: Map<ElementKey, number>;
  queue: Array<Callback>;
  hasReplaces: boolean;
  fromApi: boolean;
  inChain: boolean;
  isNonBlocking: boolean;
  pending: Callback;
};

enum Action {
  ENTER = 'enter',
  LEAVE = 'leave',
  UPDATE = 'update',
}

type KeyExtractor<I> = (x: I) => ElementKey;

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
