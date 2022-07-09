import { detectIsNumber, detectIsString, detectIsFunction } from '../helpers';
import { View, Text, type TagVirtualNodeFactory } from '../view';

function getChildren(children: Array<any>) {
  children = children.map(x => (detectIsString(x) || detectIsNumber(x) ? Text(x.toString()) : x));

  return children ? (Array.isArray(children) ? [...children] : [children]) : [];
}

function createElement(
  tag: string | Function,
  props: any,
  ...children: Array<any>
): TagVirtualNodeFactory | Function | null {
  if (detectIsString(tag)) {
    return View({
      ...props,
      as: tag,
      slot: getChildren(children),
    });
  }

  if (detectIsFunction(tag)) {
    let slot = getChildren(children);

    slot = slot.length === 1 ? slot[0] : slot;

    return tag({ ...props, slot });
  }

  return null;
}

export { createElement };
