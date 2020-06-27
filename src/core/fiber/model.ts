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
