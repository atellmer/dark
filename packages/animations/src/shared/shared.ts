import { presets } from '../presets';

export type SpringValue<T extends string> = Record<T, number>;

export type PhysicConfig = {
  mass: number;
  tension: number;
  friction: number;
  precision: number;
};

const defaultPhysicConfig: PhysicConfig = {
  ...presets.noWobble,
  mass: 1,
  precision: 2,
};

export { defaultPhysicConfig };
