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

function fixSprings<T extends string>(springs: SpringValue<T>, precision: number) {
  const springs$ = {} as SpringValue<T>;

  for (const key of Object.keys(springs)) {
    springs$[key] = fix(springs[key], precision);
  }

  return springs$;
}

function detectAreSpringsDiff<T extends string>(
  prevSprings: SpringValue<T>,
  nextSprings: SpringValue<T>,
  precision: number,
) {
  for (const key of Object.keys(nextSprings)) {
    if (fix(prevSprings[key], precision) !== fix(nextSprings[key], precision)) return true;
  }

  return false;
}

export { defaultConfig, fixSprings, detectAreSpringsDiff };
