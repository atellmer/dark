import { SlotProps, RefProps, KeyProps, FlagProps } from '../shared';
export declare type ViewDef = {
  as: string;
  isVoid?: boolean;
  [prop: string]: any;
} & Partial<SlotProps> &
  RefProps &
  KeyProps &
  FlagProps;
export declare enum NodeType {
  TAG = 'TAG',
  TEXT = 'TEXT',
  COMMENT = 'COMMENT',
}
