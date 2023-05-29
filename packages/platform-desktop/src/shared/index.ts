import { CursorShape } from '@nodegui/nodegui';

export type Size = {
  width: number;
  height: number;
  fixed?: boolean;
};

export type Position = {
  x: number;
  y: number;
};

export type WidgetProps = {
  id?: string;
  width?: number;
  height?: number;
  size?: Size;
  minSize?: Size;
  maxSize?: Size;
  position?: Position;
  styleSheet?: string;
  style?: string;
  disabled?: boolean;
  hidden?: boolean;
  cursor?: CursorShape;
};
