import { type QWidget, QGraphicsBlurEffect } from '@nodegui/nodegui';
import { BlurHint } from '@nodegui/nodegui/dist/lib/QtWidgets/QGraphicsBlurEffect';
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
} from '@dark-engine/core';

import type { WidgetProps, WithSlotProps } from '../shared';
import { illegal } from '../utils';

// <BlurEffect blurRadius={10}>
//   <Image src='https://placehold.co/600x400' />
// </BlurEffect>

export type BlurEffectProps = WithSlotProps<
  {
    ref?: Ref<BlurEffectRef>;
    blurRadius: number;
    blurHint?: BlurHint;
    disabled?: boolean;
  } & WidgetProps
>;
export type BlurEffectRef<T = QWidget> = {
  node: T;
};

const BlurEffect = component<BlurEffectProps>(
  props => {
    const { ref, blurRadius, blurHint = BlurHint.PerformanceHint, disabled = false, slot } = props;
    const component = slot as Component<BlurEffectProps>;
    const rootRef = useRef<QWidget>(null);
    const gfx = useMemo(() => new QGraphicsBlurEffect(), []);

    if (detectIsArray(slot)) {
      illegal(`The BlurEffect supports only one child node!`);
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

    component.props.ref = ref;

    return component;
  },
  { displayName: 'BlurEffect' },
) as ComponentFactory<BlurEffectProps>;

export { BlurEffect };
