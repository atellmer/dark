export enum EffectTag {
  C = 'C',
  U = 'U',
  D = 'D',
  S = 'S',
}

export enum Mask {
  INSERTION_EFFECT_HOST = 1,
  LAYOUT_EFFECT_HOST = 2,
  ASYNC_EFFECT_HOST = 4,
  ATOM_HOST = 8,
  PORTAL_HOST = 16,
  SHADOW = 32,
  FLUSH = 64,
  MOVE = 128,
}

export type NativeElement = unknown;

export type HookValue<T = any> = {
  deps: Array<any>;
  value: T;
};
