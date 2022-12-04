import { detectIsUndefined } from '../helpers';
import { useEffect } from '../use-effect';
import { useState } from '../use-state';
import { useMemo } from '../use-memo';

type UseSpringOptions = {
  state?: boolean;
  mass?: number;
  delay?: number;
  direction?: Direction;
  from?: number;
  to?: number;
};

function useSpring(options: UseSpringOptions) {
  const { state, mass = 1, from = 0, to = 1 } = options;
  const [x, setX] = useState(0);
  const scope = useMemo<Scope>(
    () => ({
      frameId: null,
      direction: null,
      values: createScopeValues(),
      skipFirstRendfer: true,
    }),
    [],
  );

  useEffect(() => {
    const { forward, backward, both } = createPhysicalValues({
      duration: PHYSICAL_DURATION,
      k: K,
      frames: FRAMES,
      mass,
      from,
      to,
    });

    scope.values = {
      forward: {
        list: forward,
        step: 0,
      },
      backward: {
        list: backward,
        step: 0,
      },
      both: {
        list: both,
        step: 0,
      },
    };
  }, [mass]);

  useEffect(() => {
    if (scope.skipFirstRendfer) return;

    const loop = (direction: Direction) => {
      scope.direction = direction;

      const { step, list } = scope.values[direction];
      const x = list[step];

      if (step > list.length - 1) {
        scope.values[direction].step = 0;
        return;
      }

      setX(x);
      scope.values[direction].step++;

      scope.frameId = requestAnimationFrame(() => {
        scope.frameId = null;
        loop(direction);
      });
    };

    if (scope.frameId) {
      cancelAnimationFrame(scope.frameId);
    }

    const direction = state ? 'forward' : 'backward';

    if (scope.values[scope.direction]?.step > 0) {
      const { list, step } = scope.values[scope.direction];
      const currentStep = getCurrentStep(list[step], scope.values[direction].list);

      scope.values[scope.direction].step = 0;
      scope.values[direction].step = currentStep;
    }

    loop(direction);
  }, [state]);

  useEffect(() => {
    scope.skipFirstRendfer = false;
  }, []);

  return { x };
}

const K = 1;
const FRAMES = 60;
const PHYSICAL_DURATION = 100000; // based on the fact that the minimum mass is 0.01 and the minimum spring constant is also 1

type Direction = 'forward' | 'backward' | 'both';

type Values = {
  list: Array<number>;
  step: number;
};

type Scope = {
  frameId: number;
  direction: Direction;
  values: {
    forward: Values;
    backward: Values;
    both: Values;
  };
  skipFirstRendfer: boolean;
};

function period(mass: number, k: number) {
  return 2 * Math.PI * Math.sqrt(mass / k);
}

function harmonic(time: number, mass: number, k: number) {
  return 1 * Math.cos(period(mass, k) * time);
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
} & Required<Pick<UseSpringOptions, 'mass' | 'from' | 'to'>>;

function createPhysicalValues(options: CreatePhysicalValuesOptions) {
  const { duration, frames, mass, k, from, to } = options;
  const size = Math.floor((duration * 2) / (1000 / frames));
  const steps = Array(size)
    .fill(null)
    .map((_, idx) => (idx + 1) / 1000);
  const source = minimax(
    steps.map(t => fix(1 - harmonic(t, mass, k), 2)),
    [from, to],
  );
  const forward = [];
  const backward = [];
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

function createScopeValues(): Scope['values'] {
  return {
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

export { useSpring };
