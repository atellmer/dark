export { Fiber } from './fiber';

export enum EffectTag {
  PLACEMENT = 'PLACEMENT',
  UPDATE = 'UPDATE',
  DELETION = 'DELETION',
};

export type NativeElement = unknown;