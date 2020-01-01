import useMemo from '@core/hooks/use-memo';
import useState from '@core/hooks/use-state';


type TransitionState = 'enter' | 'update' | 'leave';

type Transition = {
  state: TransitionState;
  item: boolean;
  key: number;
  props: TransitionProps;
}

type TransitionOptions = {
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

type UseTransitionsState = {
  prevValue: boolean;
  prevTransitions: Array<Transition>;
  updateTransitions: Array<Transition>;
}

type GetAtomicTransitionsOptions = {
  value: boolean;
  transitionState: UseTransitionsState;
  transitionOptions: TransitionOptions;
  onAnimationEnd?: Function;
  forceUpdate: (updater: any) => void;
}

function useAtomicTransitions(value: boolean, transitionOptions: TransitionOptions): Array<Transition> {
  const [_, forceUpdate] = useState(0);
  const transitionState = useMemo<UseTransitionsState>(() => ({
    prevValue: value,
    prevTransitions: [],
    updateTransitions: [],
  }), []);
  const hasDiff = transitionState.prevValue !== value || transitionState.prevTransitions.length === 0;
  const transitions = hasDiff
    ? getAtomicTransitions({
        value,
        transitionState,
        transitionOptions,
        onAnimationEnd: () => {},
        forceUpdate,
      })
    : transitionState.updateTransitions.length === 0
      ? transitionState.prevTransitions
      : transitionState.updateTransitions;

  if (hasDiff) {
    transitionState.prevValue = value;
    transitionState.prevTransitions = transitions;
  }

  //console.log('transitions', transitions);

  return transitions;
}

function getAtomicTransitions(options: GetAtomicTransitionsOptions): Array<Transition> {
  const {
    value,
    transitionState,
    transitionOptions,
    onAnimationEnd,
    forceUpdate,
  }  = options;
  const { prevTransitions } = transitionState;
  const isInitial = prevTransitions.length === 0;
  const count = isInitial
    ? 1
    : 2;
  const prevKeys = prevTransitions.map(x => x.key).sort((a, b) =>
    a > b
      ? -1
      : a < b
        ? 1
        : 0,
  );
  const maxKey = prevKeys[0] || 0;

  const transitions = Array(count).fill(null).map((_, idx) => {
    let state = 'update';
    let key = 0;
    let item = value;

    if (prevTransitions[idx]) {
      state = prevTransitions[idx].state === 'enter' ? 'leave' : 'enter';
      item = prevTransitions[idx].item;
      key = prevTransitions[idx].state === 'enter' ? prevTransitions[idx].key : maxKey + 1;
    } else {
      state = 'enter';
      key = prevTransitions[idx - 1] ? maxKey + 1 : maxKey;
    }

    const callback = state === 'enter'
      ? () => {
        requestAnimationFrame(() => {
          transitionState.updateTransitions = [
            {
              state: 'update',
              item,
              key,
              props: getPropsByState('update' as TransitionState, null, transitionOptions),
            },
          ];
          forceUpdate(c => c + 1);
          transitionState.updateTransitions = [];
        });
      }
      : onAnimationEnd;

    return {
      state: state as TransitionState,
      item,
      key,
      props: getPropsByState(state as TransitionState, callback, transitionOptions),
    }
  });

  return transitions;
};

function getPropsByState(state: TransitionState, forceUpdate?: Function, options?: TransitionOptions): TransitionProps {
  if (state === 'update') {
    return {
      className: options.enter.className,
    };
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

export default useAtomicTransitions;
