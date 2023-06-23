import { CursorShape, type QWidget, type QLayout } from '@nodegui/nodegui';
import type { DarkElement, KeyProps, SlotProps, RefProps, FlagProps } from '@dark-engine/core';

import { type EventHandler } from '../events';

export type WithStandardProps<T> = T & KeyProps & RefProps & FlagProps;

export type WithSlotProps<T, S = DarkElement> = WithStandardProps<T> & SlotProps<S>;

export type WithPartialSlotProps<T, S = DarkElement> = WithStandardProps<T> &
  Partial<Pick<WithSlotProps<T, S>, 'slot'>>;

export type WidgetProps = {
  id?: string;
  posX?: number;
  posY?: number;
  width?: number;
  height?: number;
  fixedWidth?: number;
  fixedHeight?: number;
  minimumHeight?: number;
  minimumWidth?: number;
  maximumHeight?: number;
  maximumWidth?: number;
  styleSheet?: string;
  style?: string;
  disabled?: boolean;
  hidden?: boolean;
  cursor?: CursorShape;
  on?: Record<string, EventHandler>;
};

export type QElement = QWidget | QLayout;

export interface Container {
  detectIsContainer: () => boolean;
  appendChild(child: QElement): void;
  insertBefore(child: QElement, sibling: QElement, idx: number): void;
  removeChild(child: QElement): void;
}
