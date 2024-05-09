import { QGraphicsDropShadowEffect, type QWidget, type QColor } from '@nodegui/nodegui';
import {
  type ComponentFactory,
  type Component,
  type Ref,
  component,
  useRef,
  useMemo,
  useLayoutEffect,
  useImperativeHandle,
  detectIsArray,
  illegal,
  formatErrorMsg,
} from '@dark-engine/core';

import type { WidgetProps, WithSlotProps } from '../shared';
import { LIB } from '../constants';

// <DropShadowEffect blurRadius={10} xOffset={2} yOffset={2}>
//   <Image src='https://placehold.co/600x400' />
// </DropShadowEffect>

export type DropShadowEffectProps = WithSlotProps<
  {
    ref?: Ref<DropShadowEffectRef>;
    blurRadius: number;
    xOffset?: number;
    yOffset?: number;
    color?: QColor;
    disabled?: boolean;
  } & WidgetProps
>;
export type DropShadowEffectRef<T = QWidget> = {
  node: T;
};

const DropShadowEffect = component<DropShadowEffectProps>(
  props => {
    const { ref, blurRadius, xOffset = 1, yOffset = 1, color, disabled = false, slot } = props;
    const component = slot as Component;
    const rootRef = useRef<QWidget>(null);
    const gfx = useMemo(() => new QGraphicsDropShadowEffect(), []);

    if (detectIsArray(slot)) {
      illegal(formatErrorMsg(LIB, `The DropShadowEffect supports only one child node!`));
    }

    useLayoutEffect(() => {
      rootRef.current.setGraphicsEffect(gfx);
    }, []);

    useLayoutEffect(() => {
      gfx.setBlurRadius(blurRadius);
      gfx.setXOffset(xOffset);
      gfx.setYOffset(yOffset);
      color && gfx.setColor(color);
      gfx.setEnabled(!disabled);
    }, [blurRadius, xOffset, yOffset, color, disabled]);

    useImperativeHandle(ref, () => ({ node: rootRef.current }));

    component.props.ref = rootRef;

    return component;
  },
  { displayName: 'DropShadowEffect' },
) as ComponentFactory<DropShadowEffectProps>;

export { DropShadowEffect };
