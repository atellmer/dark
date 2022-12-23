import { SlotProps, RefProps, KeyProps, FlagProps } from '../shared';

export type ViewDef = {
  as: string;
  _void?: boolean;
  [prop: string]: any;
} & Partial<SlotProps> &
  RefProps &
  KeyProps &
  FlagProps;

export enum NodeType {
  TAG = 'TAG',
  TEXT = 'TEXT',
  COMMENT = 'COMMENT',
}
