import { detectIsFunction, detectIsUndefined, detectIsNumber } from '../helpers';
import { useEffect } from '../use-effect';
import { useState } from '../use-state';
import { useMemo } from '../use-memo';
import { useEvent } from '../use-event';
import { platform } from '../platform';

type UseSpringOptions = {
  state?: boolean;
  animations: Array<Animation>;
  mount?: boolean;
  outside?: (values: Array<number>) => void;
};

function useSpring(options: UseSpringOptions, deps: Array<any>) {
  const { state, animations, mount = false, outside } = options;
  const scope = useMemo<Scope>(() => {
    const scope = {
      frameId: null,
      timerId: null,
      skipFirstRendfer: true,
      playingAnimationIdx: -1,
      animations,
      descriptors: [],
      data: [],
      keyes: [],
    };

    for (const animation of animations) {
      const descriptor = animation({ state: null, playingIdx: -1 });

      scope.descriptors.push(descriptor);
      scope.data.push(createInitialData());
    }

    return scope;
  }, []);
  const [values, setValues] = useState(() => getInitialValues(scope.descriptors), { forceSync: true });

  useEffect(() => {
    let idx = 0;

    for (const descriptor of scope.descriptors) {
      const { mass = 1, stiffness = 1, damping = 1, duration = 10000, from = 0, to = 1 } = descriptor;
      const key = createKey(descriptor);
      const cache = store[key];
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

      scope.data[idx].values = {
        forward: {
          list: forward,
          step: scope.data[idx].values.forward.step || 0,
        },
        backward: {
          list: backward,
          step: scope.data[idx].values.backward.step || 0,
        },
        mirrored: {
          list: mirrored,
          step: scope.data[idx].values.mirrored.step || 0,
        },
      };

      store[key] = scope.data[idx].values;
      idx++;
    }
  }, []);

  useEffect(() => {
    return () => {
      scope.frameId && platform.cancelAnimationFrame(scope.frameId);
      scope.timerId && window.clearTimeout(scope.timerId);
      scope.keyes.forEach(key => delete store[key]);
    };
  }, []);

  const play = useEvent((name: string, direction: Direction, sourceIdx?: number) => {
    const { descriptors } = scope;
    const idx = detectIsNumber(sourceIdx) ? sourceIdx : descriptors.findIndex(x => x.name === name);
    const { delay } = descriptors[idx];
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
          platform.requestAnimationFrame(() => {
            outside(newItems);
          });
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
    if (scope.skipFirstRendfer && !mount) return;
    (async () => {
      const { animations, playingAnimationIdx } = scope;
      const direction: Direction = state ? 'forward' : 'backward';
      const isForward = direction === 'forward';
      const transformed = isForward
        ? animations
        : animations
            .filter((_, idx) => (scope.playingAnimationIdx >= 0 ? idx <= scope.playingAnimationIdx : true))
            .reverse();

      for (const animation of transformed) {
        const descriptor = animation({ state, playingIdx: playingAnimationIdx });
        const { name, direction: ownDirection } = descriptor;
        const idx = animations.findIndex(x => x === animation);

        scope.descriptors[idx] = descriptor;

        await play(name, ownDirection || direction, idx);
      }
    })();
  }, [state, ...(deps || [])]);

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

const FRAMES = 60;
const FRAME_RATE = 1 / FRAMES;
const store: Record<string, PhysicalValues> = {};

export type Animation = (options: AnimationOptions) => AnimationDescriptor;

type AnimationOptions = {
  state: boolean;
  playingIdx: number;
};

type AnimationDescriptor = {
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
  frameId: number;
  timerId: number;
  skipFirstRendfer: boolean;
  playingAnimationIdx: number;
  animations: Array<Animation>;
  descriptors: Array<AnimationDescriptor>;
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
} & Required<Pick<AnimationDescriptor, 'mass' | 'stiffness' | 'damping' | 'duration' | 'from' | 'to'>>;

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
  const backward = forward.map(x => fix(to - x, 4));

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

function getInitialValues(descriptors: Array<AnimationDescriptor>) {
  return descriptors.map(x => {
    const value = x.direction ? (x.direction == 'forward' ? x.from : x.to) : 0;

    return value || 0;
  });
}

function createKey(descriptor: AnimationDescriptor) {
  const { mass, stiffness, damping, duration, from, to } = descriptor;

  return `${mass}:${stiffness}:${damping}:${duration}:${from}:${to}`;
}

function filterToggle(value: number, idx: number) {
  if (value !== 0 && value !== 1) return true;
  return value === 0 ? idx === 0 : value === 1 ? idx === 1 : idx === 0;
}

function mapToggle(value: number, size: number, idx: number) {
  return size === 1 ? 1 : idx === 0 ? 1 - value : value;
}

export { useSpring };
