import { type TagVirtualNodeFactory } from '../view';
declare function createElement(
  tag: string | Function,
  props: any,
  ...children: Array<any>
): TagVirtualNodeFactory | Function | null;
export { createElement };
