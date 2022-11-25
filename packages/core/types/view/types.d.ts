export declare type ViewDef = {
  as: string;
  slot?: any;
  isVoid?: boolean;
  [prop: string]: any;
};
export declare enum NodeType {
  TAG = 'TAG',
  TEXT = 'TEXT',
  COMMENT = 'COMMENT',
}
