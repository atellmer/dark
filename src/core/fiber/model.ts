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

export type HookValue<T = any> = {
  deps: Array<any>;
  value: T;
};

export type Hook<T = any> = {
  idx: number;
  values: Array<T>;
  updateScheduled: boolean;
  update: () => void;
};

export const cloneTagMap = {
  [EffectTag.PLACEMENT]: true,
  [EffectTag.SKIP]: true,
};
