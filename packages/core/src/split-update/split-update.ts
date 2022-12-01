import type { DarkElementKey, DarkElement, Subscribe, SubscriberWithValue } from '../shared';
import { type Ref } from '../ref';
import { createComponent, type ComponentFactory, type StandardComponentProps } from '../component';
import { createContext } from '../context';
import { useContext } from '../use-context';
import { useUpdate } from '../use-update';
import { useMemo } from '../use-memo';
import { useEffect } from '../use-effect';
import { useCallback } from '../use-callback';
import { memo } from '../memo';
import { keyBy } from '../helpers';

type SplitUpdateProps<T = any> = {
  list: Array<T>;
  getKey: (x: T) => DarkElementKey;
  slot: DarkElement;
};

const SplitUpdate: SplitUpdate = createComponent<SplitUpdateProps>(props => {
  const { list, getKey, slot } = props;
  const scope = useMemo<Scope>(() => ({ list, subscribers: new Set() }), []);
  const map = useMemo(() => ({ value: keyBy(list, x => getKey(x), true) }), [list]);
  const canSplit = useMemo(() => {
    if (scope.list.length !== list.length) return false;
    let idx = 0;

    for (const item of list) {
      if (getKey(item) !== getKey(scope.list[idx])) {
        return false;
      }

      idx++;
    }

    return true;
  }, [list]);

  useMemo(() => {
    scope.list = [...list];
  }, [list]);

  useEffect(() => {
    if (!canSplit) return;
    scope.subscribers.forEach(fn => fn(map.value));
  }, [list]);

  const subscribe = useCallback((subscriber: (map: Record<DarkElementKey, unknown>) => void) => {
    scope.subscribers.add(subscriber);

    return () => scope.subscribers.delete(subscriber);
  }, []);

  const contextValue = useMemo(() => ({ subscribe, map: map.value }), []);

  contextValue.map = map.value;

  return SplitUpdateContext.Provider({
    value: contextValue,
    slot: SplitUpdateGuard({ canSplit, slot }),
  });
});

type SplitUpdateGuardProps = {
  canSplit: boolean;
  slot: DarkElement;
};

const SplitUpdateGuard = memo(
  createComponent<SplitUpdateGuardProps>(({ slot }) => slot),
  (_, nextProps) => nextProps.canSplit === false,
);

const SplitUpdateContext = createContext<SplitUpdateContextValue>(null);

function useSplitUpdate<T>(selector: (map: Record<DarkElementKey, T>) => T, detectChange: (x: T) => DarkElementKey) {
  const { subscribe, map } = useContext(SplitUpdateContext);
  const update = useUpdate({ forceSync: true });
  const value = selector(map);
  const detectedChange = detectChange(value);
  const scope = useMemo(() => ({ detectedChange }), []);

  useEffect(() => {
    const unsubscribe = subscribe((map: Record<DarkElementKey, T>) => {
      const detectedChange = detectChange(selector(map));

      if (!Object.is(scope.detectedChange, detectedChange)) {
        update();
      }

      scope.detectedChange = detectedChange;
    });

    return () => unsubscribe();
  }, []);

  scope.detectedChange = detectedChange;

  return value;
}

type Scope<T = unknown> = {
  list: Array<T>;
  subscribers: Set<(map: Record<DarkElementKey, T>) => void>;
};

type SplitUpdateContextValue<T = any> = {
  subscribe: Subscribe<SubscriberWithValue<Record<DarkElementKey, T>>>;
  map: Record<DarkElementKey, T>;
};

type MergedProps<T> = SplitUpdateProps<T> & StandardComponentProps;

type SplitUpdate = <T>(props?: MergedProps<T>, ref?: Ref) => ComponentFactory<MergedProps<T>>;

export { SplitUpdate, useSplitUpdate };
