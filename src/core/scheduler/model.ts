export enum UpdatorZone {
  ROOT = 'ROOT',
  LOCAL = 'LOCAL',
};

export type Updator = {
  zone: UpdatorZone;
  run: (deadline: IdleDeadline) => void;
};
