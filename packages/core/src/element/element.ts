import { detectIsNumber, detectIsString, detectIsFunction } from '../helpers';
import { View, Text, type TagVirtualNodeFactory } from '../view';
import { type ComponentFactory } from '../component';

function transformChildren(slot: Array<any>) {
  for (let i = 0; i < slot.length; i++) {
    const element = slot[i];

    if (detectIsString(element) || detectIsNumber(element)) {
      slot[i] = Text(element);
    }
  }

  return slot;
}

function createElement(
  tag: string | Function,
  props: object,
  ...slot: Array<any>
): ComponentFactory | TagVirtualNodeFactory | null {
  if (detectIsString(tag)) {
    slot = transformChildren(slot);

    return View({ ...props, as: tag, slot });
  }

  if (detectIsFunction(tag)) {
    slot = transformChildren(slot);
    slot = slot.length === 1 ? slot[0] : slot;

    return tag({ ...props, slot });
  }

  return null;
}

export { createElement, createElement as h };
