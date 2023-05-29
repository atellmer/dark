export type Size = {
  width: number;
  height: number;
};

export type Position = {
  x: number;
  y: number;
};

export type WidgetProps = {
  id?: string;
  size?: Size;
  minSize?: Size;
  maxSize?: Size;
  position?: Position;
  styleSheet?: string;
  inlineStyle?: string;
};
