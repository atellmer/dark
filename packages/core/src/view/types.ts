import { SlotProps, RefProps, KeyProps } from '../shared';

export type ViewDef = {
  as: string;
  isVoid?: boolean;
  [prop: string]: any;
} & Partial<SlotProps> &
  RefProps &
  KeyProps;

export enum NodeType {
  TAG = 'TAG',
  TEXT = 'TEXT',
  COMMENT = 'COMMENT',
}
