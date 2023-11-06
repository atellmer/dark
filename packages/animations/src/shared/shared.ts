import { presets } from '../presets';

export type SpringValue<T extends string> = Record<T, number>;

export type SpringConfig = {
  mass: number;
  tension: number;
  friction: number;
  precision: number;
  fix: number;
};

const defaultSpringConfig: SpringConfig = {
  ...presets.noWobble,
  mass: 1,
  precision: 2,
  fix: 2,
};

export { defaultSpringConfig };
