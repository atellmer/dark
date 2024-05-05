import { type QWidget, QGraphicsBlurEffect } from '@nodegui/nodegui';
import { BlurHint } from '@nodegui/nodegui/dist/lib/QtWidgets/QGraphicsBlurEffect';
import {
  type ComponentFactory,
  type Component,
  component,
  forwardRef,
  useRef,
  useMemo,
  useLayoutEffect,
  useImperativeHandle,
  detectIsArray,
  illegal,
} from '@dark-engine/core';

import type { WidgetProps, WithSlotProps } from '../shared';

// <BlurEffect blurRadius={10}>
//   <Image src='https://placehold.co/600x400' />
// </BlurEffect>

export type BlurEffectProps = WithSlotProps<
  {
    blurRadius: number;
    blurHint?: BlurHint;
    disabled?: boolean;
  } & WidgetProps
>;
export type BlurEffectRef<T = QWidget> = {
  node: T;
};

const BlurEffect = forwardRef<BlurEffectProps, BlurEffectRef>(
  component(
    (props, ref) => {
      const { blurRadius, blurHint = BlurHint.PerformanceHint, disabled = false, slot } = props;
      const component = slot as Component;
      const rootRef = useRef<QWidget>(null);
      const gfx = useMemo(() => new QGraphicsBlurEffect(), []);

      if (detectIsArray(slot)) {
        illegal(`[platform-desktop]: BlurEffect supports only one child node!`);
      }

      useLayoutEffect(() => {
        rootRef.current.setGraphicsEffect(gfx);
      }, []);

      useLayoutEffect(() => {
        gfx.setBlurRadius(blurRadius);
        gfx.setBlurHints(blurHint);
        gfx.setEnabled(!disabled);
      }, [blurRadius, blurHint, disabled]);

      useImperativeHandle(ref, () => ({ node: rootRef.current }));

      component.props.ref = rootRef;

      return component;
    },
    { displayName: 'BlurEffect' },
  ),
) as ComponentFactory<BlurEffectProps, BlurEffectRef>;

export { BlurEffect };
