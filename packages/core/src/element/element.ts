import { detectIsString, detectIsFunction } from '../helpers';
import { type TagVirtualNodeFactory, type ViewOptions, View } from '../view';
import { type ComponentFactory } from '../component';

function createElement(
  element: string | Function,
  props: object,
  ...slot: Array<any>
): ComponentFactory | TagVirtualNodeFactory | null {
  if (detectIsString(element)) {
    const options = (props || {}) as ViewOptions;

    options.as = element;
    options.slot = slot;

    return View(options);
  }

  if (detectIsFunction(element)) {
    const options = (props || {}) as { slot: unknown };

    options.slot = slot.length === 1 ? slot[0] : slot;

    return element(options);
  }

  return null;
}

export { createElement, createElement as h };
