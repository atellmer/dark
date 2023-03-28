import { detectIsFunction, detectIsUndefined, detectIsNumber } from '../helpers';
import { useEffect } from '../use-effect';
import { useState } from '../use-state';
import { useMemo } from '../use-memo';
import { useEvent } from '../use-event';
import { platform } from '../platform';
import { TaskPriority } from '../constants';
import { batch } from '../batch';

type UseSpringOptions = {
  state?: boolean;
  getAnimations: (options: AnimationOptions) => Array<Animation>;
  mount?: boolean;
  deps?: Array<any>;
  outside?: (values: Array<number>) => void;
};

function useSpring(options: UseSpringOptions, deps: Array<any> = []) {
  const { state, getAnimations, mount = false, deps: updatingDeps = [], outside } = options;
  const scope = useMemo<Scope>(() => {
    const scope = {
      getAnimations,
      loopTimerId: null,
      delayTimerId: null,
      skipFirstRendfer: true,
      playingIdx: -1,
      data: getAnimations(createDefaultOptions()).map(() => createInitialData()),
      keyes: [],
    };

    return scope;
  }, []);
  const [values, setValues] = useState(() => getInitialValues(getAnimations(createDefaultOptions())), {
    priority: TaskPriority.ANIMATION,
  });

  useEffect(() => {
    const animations = getAnimations({ state, playingIdx: scope.playingIdx });
    let idx = 0;

    for (const animation of animations) {
      const { mass = 1, stiffness = 1, damping = 1, duration = 10000, from = 0, to = 1 } = animation;
      const key = createKey(animation);
      const cache = store[key];
      const slice = scope.data[idx];
      let forward: Array<number> = [];
      let backward: Array<number> = [];
      let mirrored: Array<number> = [];

      scope.keyes.push(key);

      if (cache) {
        forward = cache.forward.list;
        backward = cache.backward.list;
        mirrored = cache.mirrored.list;
      } else {
        const values = createPhysicalValues({
          frameRate: FRAME_RATE,
          duration,
          stiffness,
          damping,
          mass,
          from,
          to,
        });

        forward = values.forward;
        backward = values.backward;
        mirrored = values.mirrored;
      }

      slice.values = {
        forward: {
          ...slice.values.forward,
          list: forward,
        },
        backward: {
          ...slice.values.backward,
          list: backward,
        },
        mirrored: {
          ...slice.values.mirrored,
          list: mirrored,
        },
      };

      store[key] = slice.values;
      idx++;
    }

    scope.getAnimations = getAnimations;
  }, [...deps]);

  useEffect(() => {
    return () => {
      scope.loopTimerId && clearTimeout(scope.loopTimerId as number);
      scope.delayTimerId && clearTimeout(scope.delayTimerId as number);
      scope.keyes.forEach(key => delete store[key]);
    };
  }, []);

  useEffect(() => {
    if (scope.skipFirstRendfer && !mount) return;
    (async () => {
      const { getAnimations, playingIdx } = scope;
      const animations = getAnimations({ state, playingIdx });
      const direction: Direction = state ? 'forward' : 'backward';
      const isForward = direction === 'forward';
      const transformed = isForward
        ? animations
        : animations.filter((_, idx) => (playingIdx >= 0 ? idx <= playingIdx : true)).reverse();

      for (const animation of transformed) {
        const { name, direction: ownDirection } = animation;
        const idx = animations.findIndex(x => x === animation);

        await play(name, ownDirection || direction, idx);
      }
    })();
  }, [state, ...updatingDeps]);

  useEffect(() => {
    scope.skipFirstRendfer = false;
  }, []);

  const play = useEvent((name: string, direction: Direction, sourceIdx?: number) => {
    const { getAnimations, playingIdx } = scope;
    const animations = getAnimations({ state, playingIdx });
    const idx = detectIsNumber(sourceIdx) ? sourceIdx : animations.findIndex(x => x.name === name);
    const { delay } = animations[idx];

    scope.playingIdx = idx;

    return new Promise<boolean>(resolve => {
      const loop = (direction: Direction) => {
        scope.data[idx].direction = direction;
        scope.playingIdx = idx;

        const { step, list } = scope.data[idx].values[direction];
        const x = list[step];

        if (step > list.length - 1) {
          scope.data[idx].values[direction].step = 0;
          scope.playingIdx = -1;

          return resolve(true);
        }

        const newItems = [...values];

        newItems[idx] = x;

        if (detectIsFunction(outside)) {
          platform.raf(() => outside(newItems));
        } else {
          batch(() => setValues(newItems));
        }

        scope.data[idx].values[direction].step++;
        scope.loopTimerId = setTimeout(() => loop(direction), LOOP_INTERVAL);
      };

      if (playingIdx >= 0) {
        scope.loopTimerId && clearTimeout(scope.loopTimerId as number);
        scope.delayTimerId && clearTimeout(scope.delayTimerId as number);
        scope.loopTimerId = null;
        scope.delayTimerId = null;
        const slice = scope.data[playingIdx];

        if (!slice.direction) return;

        if (slice.values[slice.direction].step > 0) {
          const { list, step } = slice.values[slice.direction];
          const currentStep = getCurrentStep(list[step], slice.values[direction].list);

          slice.values[slice.direction].step = 0;
          slice.values[direction].step = currentStep;
        }
      }

      if (delay) {
        scope.delayTimerId = setTimeout(() => loop(direction), delay);
      } else {
        loop(direction);
      }
    });
  });

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

const FRAMES = 60;
const FRAME_RATE = 1 / FRAMES;
const LOOP_INTERVAL = FRAME_RATE * 1000;
const store: Record<string, PhysicalValues> = {};

type AnimationOptions = {
  state: boolean;
  playingIdx: number;
};

export type Animation = {
  name: string;
  direction?: Direction;
  mass?: number;
  stiffness?: number;
  damping?: number;
  duration?: number;
  delay?: number;
  from?: number;
  to?: number;
};

type Direction = 'forward' | 'backward' | 'mirrored';

type Scope = {
  getAnimations: (options: AnimationOptions) => Array<Animation>;
  loopTimerId: number | NodeJS.Timeout;
  delayTimerId: number | NodeJS.Timeout;
  skipFirstRendfer: boolean;
  playingIdx: number;
  data: Array<AnimationData>;
  keyes: Array<string>;
};

type PhysicalSlice = {
  list: Array<number>;
  step: number;
};

type PhysicalValues = {
  forward: PhysicalSlice;
  backward: PhysicalSlice;
  mirrored: PhysicalSlice;
};

type AnimationData = {
  direction: Direction;
  values: PhysicalValues;
};

function createInitialData(): AnimationData {
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
      mirrored: {
        list: [],
        step: 0,
      },
    },
  };
}

function minimax(values: Array<number>, from: number, to: number): Array<number> {
  const a = from;
  const b = to;
  const xMin = Math.min(...values);
  const xMax = Math.max(...values);
  const normal = [];

  for (let i = 0; i < values.length; i++) {
    normal[i] = fix(a + ((values[i] - xMin) / (xMax - xMin)) * (b - a), 4);
  }

  return normal;
}

function fix(x: number, precision = 4): number {
  return Number(x.toFixed(precision));
}

type CreatePhysicalValuesOptions = {
  frameRate: number;
} & Required<Pick<Animation, 'mass' | 'stiffness' | 'damping' | 'duration' | 'from' | 'to'>>;

function createPhysicalValues(options: CreatePhysicalValuesOptions) {
  const { frameRate, mass, stiffness, damping, duration, from, to } = options;
  const size = Math.floor(duration / 1000 / frameRate);
  const l = 1;
  const initial = 2;
  let x = initial;
  let v = 0;
  let i = 0;
  const k = -stiffness;
  const d = -damping;
  const values: Array<number> = [];

  while (i < size) {
    const a = (k * (x - l) + d * v) / mass;

    v += a * frameRate;
    x += v * frameRate;

    values.push(initial - x);
    i++;
  }

  const forward = minimax(values, from, to);
  const mirrored = [...forward].reverse();
  const backward = forward.map(x => fix(from + to - x, 4));

  return {
    forward,
    backward,
    mirrored,
  };
}

function getCurrentStep(x: number, list: Array<number>) {
  for (let i = 0; i < list.length; i++) {
    const value = list[i];
    const prevValue = list[i - 1];
    const nextValue = list[i + 1];
    const hasValues = !detectIsUndefined(prevValue) && !detectIsUndefined(nextValue);

    if (value === x || (hasValues && ((prevValue < x && nextValue > x) || (prevValue > x && nextValue < x)))) {
      return i;
    }
  }

  return 0;
}

function getInitialValues(animations: Array<Animation>) {
  return animations.map(animation => {
    const { direction, from, to } = animation;
    const value = direction ? (direction === 'forward' ? from : to) : from;

    return value || 0;
  });
}

function createKey(animation: Animation) {
  const { mass, stiffness, damping, duration, from, to } = animation;

  return `${mass}:${stiffness}:${damping}:${duration}:${from}:${to}`;
}

function createDefaultOptions(): AnimationOptions {
  return {
    state: null,
    playingIdx: -1,
  };
}

function filterToggle(value: number, idx: number) {
  if (value !== 0 && value !== 1) return true;
  return value === 0 ? idx === 0 : value === 1 ? idx === 1 : idx === 0;
}

function mapToggle(value: number, size: number, idx: number) {
  return size === 1 ? 1 : idx === 0 ? 1 - value : value;
}

export { useSpring };
