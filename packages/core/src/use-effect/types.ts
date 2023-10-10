export type DropEffect = void | (() => void);

export type Effect = () => DropEffect;

export enum EffectType {
  ASYNC = 'ASYNC',
  LAYOUT = 'LAYOUT',
  INSERTION = 'INSERTION',
}
