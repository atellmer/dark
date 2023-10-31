import { fix } from '../utils';
import { presets } from '../presets';

export type SpringValue<T extends string> = Record<T, number>;

export type Config = {
  mass: number;
  tension: number;
  friction: number;
  precision: number;
};

const defaultConfig: Config = {
  ...presets.noWobble,
  mass: 1,
  precision: 2,
};

function fixValue<T extends string>(value: SpringValue<T>, precision: number) {
  const value$ = {} as SpringValue<T>;

  for (const key of Object.keys(value)) {
    value$[key] = fix(value[key], precision);
  }

  return value$;
}

function detectAreValuesDiff<T extends string>(
  prevValue: SpringValue<T>,
  nextValue: SpringValue<T>,
  precision: number,
) {
  for (const key of Object.keys(nextValue)) {
    if (fix(prevValue[key], precision) !== fix(nextValue[key], precision)) return true;
  }

  return false;
}

export { defaultConfig, fixValue, detectAreValuesDiff };
