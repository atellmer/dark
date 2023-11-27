import { preset } from '../preset';

export type SpringValue<T extends string = string> = Record<T, number>;

export type SpringConfig = {
  mass: number;
  tension: number;
  friction: number;
  precision: number;
  fix: number;
};

export type Key = string | number;

const defaultSpringConfig: SpringConfig = {
  ...preset('no-wobble'),
  mass: 1,
  precision: 3,
  fix: 4,
};

export { defaultSpringConfig };
