import { detectIsFunction, detectIsUndefined } from '../helpers';
import { useEffect } from '../use-effect';
import { useState } from '../use-state';
import { useMemo } from '../use-memo';
import { useEvent } from '../use-event';
import { platform } from '../platform';

type UseSpringOptions = {
  state?: boolean;
  animations: Array<Animation>;
  skipFirst?: boolean;
  outside?: (values: Array<number>) => void;
};

function useSpring(options: UseSpringOptions) {
  const { state, animations, skipFirst, outside } = options;
  const [values, setValues] = useState<Array<number>>(() => getInitialValues(animations), { forceSync: true });
  const scope = useMemo<Scope>(
    () => ({
      frameId: null,
      timerId: null,
      skipFirstRendfer: true,
      playingAnimationIdx: -1,
      data: animations.map(() => createAnimationData()),
    }),
    [],
  );

  useEffect(() => {
    let idx = 0;

    for (const animation of animations) {
      const { mass = 1, from = 0, to = 1 } = animation;
      const key = `${mass}:${from}:${to}`;
      const cache = store[key];
      let forward: Array<number> = [];
      let backward: Array<number> = [];
      let both: Array<number> = [];

      if (cache) {
        forward = cache.forward.list;
        backward = cache.backward.list;
        both = cache.both.list;
      } else {
        const values = createPhysicalValues({
          duration: PHYSICAL_DURATION,
          k: K,
          frames: FRAMES,
          fn: invertedHarmonic,
          mass,
          from,
          to,
        });

        forward = values.forward;
        backward = values.backward;
        both = values.both;
      }

      scope.data[idx].values = {
        forward: {
          list: forward,
          step: scope.data[idx].values.forward.step || 0,
        },
        backward: {
          list: backward,
          step: scope.data[idx].values.backward.step || 0,
        },
        both: {
          list: both,
          step: scope.data[idx].values.both.step || 0,
        },
      };

      store[key] = scope.data[idx].values;
      idx++;
    }
  }, [animations]);

  useEffect(() => {
    return () => {
      scope.frameId && platform.cancelAnimationFrame(scope.frameId);
      scope.timerId && window.clearTimeout(scope.timerId);
    };
  }, []);

  const play = useEvent((name: string, direction: Direction) => {
    const idx = animations.findIndex(x => x.name === name);
    const animation = animations[idx];
    const { delay } = animation;
    const { playingAnimationIdx } = scope;

    scope.playingAnimationIdx = idx;

    return new Promise<boolean>(resolve => {
      const loop = (direction: Direction) => {
        scope.data[idx].direction = direction;
        scope.playingAnimationIdx = idx;

        const { step, list } = scope.data[idx].values[direction];
        const x = list[step];

        if (step > list.length - 1) {
          scope.data[idx].values[direction].step = 0;
          scope.playingAnimationIdx = -1;

          return resolve(true);
        }

        const newItems = [...values];

        newItems[idx] = x;

        if (detectIsFunction(outside)) {
          outside(newItems);
        } else {
          setValues(newItems);
        }

        scope.data[idx].values[direction].step++;
        scope.frameId = platform.requestAnimationFrame(() => loop(direction));
      };

      if (playingAnimationIdx >= 0) {
        scope.frameId && platform.cancelAnimationFrame(scope.frameId);
        scope.timerId && window.clearTimeout(scope.timerId);
        scope.frameId = null;
        scope.timerId = null;
        const slice = scope.data[playingAnimationIdx];

        if (!slice.direction) return;

        if (slice.values[slice.direction].step > 0) {
          const { list, step } = slice.values[slice.direction];
          const currentStep = getCurrentStep(list[step], slice.values[direction].list);

          slice.values[slice.direction].step = 0;
          slice.values[direction].step = currentStep;
        }
      }

      if (delay) {
        scope.timerId = window.setTimeout(() => loop(direction), delay);
      } else {
        loop(direction);
      }
    });
  });

  useEffect(() => {
    if (scope.skipFirstRendfer && skipFirst) return;
    (async () => {
      const direction: Direction = state ? 'forward' : 'backward';
      const isForward = direction === 'forward';
      const transformed = isForward
        ? animations
        : animations
            .filter((_, idx) => (scope.playingAnimationIdx >= 0 ? idx <= scope.playingAnimationIdx : true))
            .reverse();

      for (const animation of transformed) {
        await play(animation.name, animation.direction || direction);
      }
    })();
  }, [state]);

  useEffect(() => {
    scope.skipFirstRendfer = false;
  }, []);

  const api = useMemo(
    () => ({
      play,
      toggle: {
        filter: filterToggle,
        map: mapToggle,
      },
    }),
    [],
  );

  return { values, api };
}

const store: Record<
  string,
  {
    forward: Values;
    backward: Values;
    both: Values;
  }
> = {};

const K = 1;
const FRAMES = 60;
const PHYSICAL_DURATION = 100000; // based on the fact that the minimum mass is 0.01 and the minimum spring constant is also 1

type Direction = 'forward' | 'backward' | 'both';

export type Animation = {
  name: string;
  mass?: number;
  direction?: Direction;
  from?: number;
  to?: number;
  delay?: number;
};

type Values = {
  list: Array<number>;
  step: number;
};

type Scope = {
  frameId: number;
  timerId: number;
  skipFirstRendfer: boolean;
  playingAnimationIdx: number;
  data: Array<AnimationData>;
};

type AnimationData = {
  direction: Direction;
  values: {
    forward: Values;
    backward: Values;
    both: Values;
  };
};

function createAnimationData(): AnimationData {
  return {
    direction: null,
    values: {
      forward: {
        list: [],
        step: 0,
      },
      backward: {
        list: [],
        step: 0,
      },
      both: {
        list: [],
        step: 0,
      },
    },
  };
}

function period(m: number, k: number) {
  return 2 * Math.PI * Math.sqrt(m / k);
}

function harmonic(t: number, m: number, k: number) {
  return 1 * Math.cos(period(m, k) * t);
}

function invertedHarmonic(t: number, m: number, k: number) {
  return 1 - harmonic(t, m, k);
}

function minimax(values: Array<number>, interval: [number, number]): Array<number> {
  const a = interval[0];
  const b = interval[1];
  const xMin = Math.min(...values);
  const xMax = Math.max(...values);
  const normal = [];

  for (let i = 0; i < values.length; i++) {
    normal[i] = fix(a + ((values[i] - xMin) / (xMax - xMin)) * (b - a), 2);
  }

  return normal;
}

function fix(x: number, precision = 4): number {
  return Number(x.toFixed(precision));
}

type CreatePhysicalValuesOptions = {
  duration: number;
  k: number;
  frames: number;
  fn: (t: number, m: number, k: number) => number;
} & Required<Pick<Animation, 'mass' | 'from' | 'to'>>;

function createPhysicalValues(options: CreatePhysicalValuesOptions) {
  const { duration, frames, mass: m, k, from, to, fn } = options;
  const size = Math.floor((duration * 2) / (1000 / frames));
  const steps = Array(size)
    .fill(null)
    .map((_, idx) => (idx + 1) / 1000);
  const source = minimax(
    steps.map(t => fix(fn(t, m, k), 2)),
    [from, to],
  );
  const forward: Array<number> = [];
  const backward: Array<number> = [];
  let isForwardCompleted = false;

  for (const value of source) {
    if (!isForwardCompleted) {
      if (value <= to) {
        forward.push(value);
      }

      if (value === to) {
        isForwardCompleted = true;
      }
    } else {
      if (value >= from) {
        backward.push(value);
      }

      if (value === from) {
        break;
      }
    }
  }

  return {
    forward,
    backward,
    both: [...forward, ...backward],
  };
}

function getCurrentStep(x: number, list: Array<number>) {
  for (let i = 0; i < list.length; i++) {
    const value = list[i];
    const prevValue = list[i - 1];
    const nextValue = list[i + 1];

    if (
      value === x ||
      (!detectIsUndefined(prevValue) && !detectIsUndefined(nextValue) && prevValue < x && nextValue > x)
    ) {
      return i;
    }
  }

  return 0;
}

function getInitialValues(animations: Array<Animation>) {
  return animations.map(x => {
    const value = x.direction ? (x.direction == 'forward' ? x.from : x.to) : 0;

    return value || 0;
  });
}

const filterToggle = (value: number, idx: number) => {
  if (value !== 0 && value !== 1) return true;
  return value === 0 ? idx === 0 : value === 1 ? idx === 1 : idx === 0;
};

const mapToggle = (value: number, size: number, idx: number) => {
  return size === 1 ? 1 : idx === 0 ? 1 - value : value;
};

export { useSpring };
