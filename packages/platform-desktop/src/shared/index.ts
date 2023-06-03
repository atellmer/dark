import { CursorShape, type QWidget, type QLayout } from '@nodegui/nodegui';
import type { DarkElement, KeyProps, SlotProps, RefProps, FlagProps } from '@dark-engine/core';
import { detectIsObject } from '@dark-engine/core';

import { type EventHandler } from '../events';

export type WithStandardProps<T> = T & KeyProps & RefProps & FlagProps;

export type WithExtendedProps<T, S = DarkElement> = T & WithStandardProps<T> & SlotProps<S>;

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
  pos?: Position;
  styleSheet?: string;
  style?: string;
  disabled?: boolean;
  hidden?: boolean;
  cursor?: CursorShape;
  on?: Record<string, EventHandler>;
};

export type QElement = QWidget | QLayout;

export interface Container {
  isContainer: boolean;
  appendChild(child: QElement): void;
  insertBefore(child: QElement, sibling: QElement): void;
  removeChild(child: QElement): void;
}

function detectIsContainer(element: unknown): element is Container {
  return element && detectIsObject(element) && (element as Container).isContainer === true;
}

export { detectIsContainer };
