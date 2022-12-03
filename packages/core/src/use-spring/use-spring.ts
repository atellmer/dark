import { useEffect } from '../use-effect';
import { useState } from '../use-state';
import { useMemo } from '../use-memo';
import { useUpdate } from '../use-update';

function period(mass: number, k: number) {
  return 2 * Math.PI * Math.sqrt(mass / k);
}

function harmonic(time: number, mass: number, k: number) {
  return 1 * Math.cos(period(mass, k) * time);
}

function minimax(x: number) {
  const min = -1 * 1;
  const max = 1 * 1;
  const a = 0;
  const b = 1;
  const y = a + ((x - min) / (max - min)) * (b - a);

  return y;
}

function fix(x: number, precision = 4): number {
  return Number(x.toFixed(precision));
}

type UseSpringOptions = {
  state: boolean | null;
  mass?: number;
  k?: number;
};

function useSpring(options: UseSpringOptions) {
  const { state, mass = 1, k = 1 } = options;
  const [value, setValue] = useState(0);
  const update = useUpdate();
  const scope = useMemo(() => ({ frameId: null, time: 0, trail: null }), []);

  useEffect(() => {
    if (state === null) return;
    const startTime = Date.now();
    const initialTime = scope.time;

    function loop() {
      scope.frameId && cancelAnimationFrame(scope.frameId);
      scope.frameId = requestAnimationFrame(() => {
        scope.frameId = null;
        const time = (Date.now() - startTime) / 1000 - initialTime;
        const value = fix(1 - minimax(harmonic(time, mass, k)), 2);

        setValue(value);
        scope.time = time;

        if (state && value === 1) {
          scope.trail = true;
          update();
          return;
        }

        if (!state && value === 0) {
          scope.trail = false;
          update();
          return;
        }

        loop();
      });
    }

    loop();
  }, [state]);

  return { value, trail: scope.trail, filterToggle, mapToggle };
}

const filterToggle = (value: number, idx: number) => {
  if (value !== 0 && value !== 1) return true;
  return value === 0 ? idx === 0 : value === 1 ? idx === 1 : idx === 0;
};

const mapToggle = (value: number, size: number, idx: number) => {
  return size === 1 ? 1 : idx === 0 ? fix(1 - value, 2) : value;
};

export { useSpring };
