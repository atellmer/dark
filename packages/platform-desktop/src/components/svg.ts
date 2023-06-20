import { QSvgWidget } from '@nodegui/nodegui';
import { type ComponentFactory, component, forwardRef } from '@dark-engine/core';

import type { WidgetProps, WithStandardProps } from '../shared';
import { qSvg } from '../factory';

export type SvgProps = WithStandardProps<
  {
    source?: string;
    path?: string;
  } & WidgetProps
>;
export type SvgRef = QDarkSvg;

const Svg = forwardRef<SvgProps, SvgRef>(
  component((props, ref) => qSvg({ ref, ...props }), { displayName: 'Svg' }),
) as ComponentFactory<SvgProps, SvgRef>;

class QDarkSvg extends QSvgWidget {
  setSource(value: string) {
    this.load(Buffer.from(value, 'utf-8'));
  }

  setPath(value: string) {
    this.load(value);
  }
}

export { Svg, QDarkSvg };
