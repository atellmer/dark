import { detectIsString, detectIsFunction } from '../helpers';
import { View, type TagVirtualNodeFactory } from '../view';
import { type ComponentFactory } from '../component';

function createElement(
  element: string | Function,
  props: object,
  ...slot: Array<any>
): ComponentFactory | TagVirtualNodeFactory | null {
  if (detectIsString(element)) {
    return View({ ...props, as: element, slot });
  }

  if (detectIsFunction(element)) {
    return element({ ...props, slot: slot.length === 1 ? slot[0] : slot });
  }

  return null;
}

export { createElement, createElement as h };
