export type ViewDef = {
  as: string;
  slot?: any;
  isVoid?: boolean;
  [prop: string]: any;
};

export enum NodeType {
  TAG = 'TAG',
  TEXT = 'TEXT',
  COMMENT = 'COMMENT',
}
