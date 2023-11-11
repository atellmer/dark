import { presets } from '../presets';
import { type Controller } from '../controller';

export type SpringValue<T extends string> = Record<T, number>;

export type SpringItem<T extends string = string> = {
  ctrl: Controller<T>;
  getValue: () => SpringValue<T>;
  detectIsActive: () => boolean;
};

export type SpringConfig = {
  mass: number;
  tension: number;
  friction: number;
  precision: number;
  fix: number;
};

export type Key = string | number;

const defaultSpringConfig: SpringConfig = {
  ...presets.noWobble,
  mass: 1,
  precision: 3,
  fix: 4,
};

export { defaultSpringConfig };
