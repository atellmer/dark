import { DarkElementKey } from '../shared';

export type ViewDef = {
  as: string;
  slot?: any;
  isVoid?: boolean;
  key?: DarkElementKey;
  [prop: string]: any;
};

export enum NodeType {
  TAG = 'TAG',
  TEXT = 'TEXT',
  COMMENT = 'COMMENT',
}
