import { type TagVirtualNodeFactory } from '../view';
import { type ComponentFactory } from '../component';
declare function createElement(
  tag: string | Function,
  props: any,
  ...children: Array<any>
): ComponentFactory | TagVirtualNodeFactory | null;
export { createElement, createElement as h };
