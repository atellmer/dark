export enum EffectTag {
  PLACEMENT = 'PLACEMENT',
  UPDATE = 'UPDATE',
  DELETION = 'DELETION',
  SKIP = 'SKIP',
};

export type NativeElement = unknown;

export type WorkLoopOptions = {
  deadline?: IdleDeadline;
  onRender?: () => void;
};

export type Hook = {
  idx: number;
  values: Array<any>;
};

export const cloneTagMap = {
  [EffectTag.PLACEMENT]: true,
  [EffectTag.SKIP]: true,
};