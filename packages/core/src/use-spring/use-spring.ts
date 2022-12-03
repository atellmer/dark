import { useEffect } from '../use-effect';
import { useState } from '../use-state';
import { useMemo } from '../use-memo';
import { batch } from '../batch';

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
  state: boolean;
};

function useSpring(options: UseSpringOptions) {
  const { state } = options;
  const [value, setValue] = useState(0);
  const [time, setTime] = useState(0);
  const scope = useMemo(() => ({ frameId: null }), []);

  useEffect(() => {
    const startTime = Date.now();
    const mass = 1;
    const k = 1;

    function update() {
      scope.frameId && cancelAnimationFrame(scope.frameId);
      scope.frameId = requestAnimationFrame(() => {
        scope.frameId = null;
        const t = (Date.now() - startTime) / 1000 - time;
        const value = fix(1 - minimax(harmonic(t, mass, k)), 2);

        batch(() => {
          setValue(value);
          setTime(t);
        });

        if ((state && value === 1) || (!state && value === 0)) return;
        update();
      });
    }

    if (state !== null) {
      update();
    }
  }, [state]);

  return value;
}

export { useSpring };
