import useMemo from '@core/hooks/use-memo';
import useState from '@core/hooks/use-state';
import { isArray } from '@helpers';


type TransitionState = 'enter' | 'update' | 'leave';

type Transition<T> = {
  state: TransitionState;
  item: T;
  key: string | number;
  props: TransitionProps;
}

export type TransitionOptions = {
  enter: {
    className?: string;
  };
  leave: {
    className?: string;
  };
}

type TransitionProps = {
  className?: string;
  onAnimationEnd?: Function;
}

type UseTransitionsState<T = any> = {
  keyMap: Record<string, boolean>;
  prevItems: Array<T>;
}

type GetTransitionsOptions<T> = {
  items: Array<T>;
  diffKeyMap?: Record<string, boolean>;
  keyMap: Record<string, boolean>;
  getKey: GetKey<T>;
  forceUpdate: (updater: any) => void;
  transitionOptions: TransitionOptions,
  onAnimationEnd?: Function;
}

export type GetKey<T> =  (item: T) => string | number | null;

function useListTransitions<T>(items: Array<T>, getKey: GetKey<T>, transitionOptions: TransitionOptions) {
  const [_, forceUpdate] = useState(0);
  const state = useMemo<UseTransitionsState>(() => ({ keyMap: {}, prevItems: [] }), []);
  const {
    keyMap,
    prevItems,
  } = state;

  const diffKeyMap = isArray(items)
    ? getDiffKeyMap(items, prevItems as Array<T>, getKey)
    : {};
  const hasDiff = Object.keys(diffKeyMap).length > 0;
  const transitions: Array<Transition<T>> = hasDiff
    ? getTransitions({
        items: prevItems,
        diffKeyMap,
        keyMap,
        getKey,
        forceUpdate,
        transitionOptions,
        onAnimationEnd: () => {
          requestAnimationFrame(() => {
            forceUpdate(x => x + 1);
          });
        },
      })
    : getTransitions({
        items,
        keyMap,
        getKey,
        forceUpdate,
        transitionOptions,
      });

  state.prevItems = items;

  return transitions;
}

function getTransitions<T>(options: GetTransitionsOptions<T>): Array<Transition<T>> {
  const {
    items,
    diffKeyMap = {},
    keyMap,
    getKey,
    onAnimationEnd,
    forceUpdate,
    transitionOptions,
  } = options;
  const transitions = items.map((x, idx, arr) => {
    let state = 'update';
    const key = getKey(x);
    const hasDiff = diffKeyMap[key];
    const isLast = idx === arr.length - 1;

    if (typeof items === 'boolean') {
      if (items) {
        state = 'enter';
      } else {
        state = 'leave';
      }
    } else {
      if (typeof keyMap[key] === 'undefined') {
        state = 'enter';
        keyMap[key] = true;
      } else if (hasDiff) {
        state = 'leave';
        delete keyMap[key];
      }
    }

    const callback = isLast && state === 'enter'
      ? () => {
        requestAnimationFrame(() => {
          forceUpdate(x => x + 1);
        });
      }
      : onAnimationEnd;

    const transition: Transition<T> = {
      state: state as TransitionState,
      item: x,
      key: getKey(x),
      props: getPropsByState(state as TransitionState, callback, transitionOptions),
    };

    return transition;
  });

  return transitions;
};


function getDiffKeyMap<T>(items: Array<T>, prevItems: Array<T>, getKey: (item: T) => string | number): Record<string, boolean> {
  const diffKeyMap = {};
  const iterations = Math.max(items.length, prevItems.length);
  let idxShift = 0;

  for (let i = 0; i < iterations; i++) {
    const item = items[i];
    const prevItem = prevItems[i + idxShift];
    const key = item && getKey(item);
    const prevKey = prevItem && getKey(prevItem);
    const hasDiff = prevKey && key !== prevKey;

    if (hasDiff) {
      key && idxShift++;
      diffKeyMap[prevKey] = true;
    }
  }

  return diffKeyMap;
};

function getPropsByState(state: TransitionState, forceUpdate: Function, options: TransitionOptions): TransitionProps {
  if (state === 'update') {
    return {};
  } else if (state === 'enter') {
    return {
      className: options.enter.className,
      onAnimationEnd: forceUpdate,
    }
  }

  return {
    className: options.leave.className,
    onAnimationEnd: forceUpdate,
  }
};

export default useListTransitions;
