import { detectIsString, detectIsFunction, detectIsEmpty, detectIsUndefined } from './utils';
import { type TagVirtualNodeFactory, type ViewOptions, View } from './view';
import { type ComponentFactory, type Component } from './component';
import { type DarkElement, type ElementKey } from './shared';
import { KEY_ATTR } from './constants';
import { Fragment } from './fragment';

function jsx(
  element: string | ComponentFactory,
  props: { children?: unknown; slot?: unknown },
  key?: ElementKey,
): TagVirtualNodeFactory | Component | null {
  const { children, slot: $slot, ...$props } = props;
  const slot = !detectIsUndefined(children)
    ? [children as DarkElement]
    : !detectIsUndefined($slot)
    ? [$slot as DarkElement]
    : [];

  if (key || !detectIsEmpty(key)) {
    $props[KEY_ATTR] = key;
  }

  if (detectIsString(element)) {
    const options = ($props || {}) as ViewOptions;

    options.as = element;
    options.slot = slot;

    return View(options);
  }

  if (detectIsFunction(element)) {
    const options = ($props || {}) as { slot: unknown };

    options.slot = slot.length === 1 ? slot[0] : slot;

    return element(options);
  }

  return null;
}

export { jsx, jsx as jsxs, jsx as jsxDEV, Fragment };
