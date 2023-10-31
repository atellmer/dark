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

export { defaultConfig };
