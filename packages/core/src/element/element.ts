import { type TagVirtualNodeFactory, type ViewOptions, View } from '../view';
import { type ComponentFactory, type Component } from '../component';
import { detectIsString, detectIsFunction } from '../utils';

function createElement(
  element: string | ComponentFactory,
  props: object,
  ...slot: Array<any>
): TagVirtualNodeFactory | Component | null {
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
