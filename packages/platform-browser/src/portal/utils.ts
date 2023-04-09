import { type Fiber, detectIsComponent } from '@dark-engine/core';

import type { TagNativeElement } from '../native-element';

const $$portal = Symbol('portal');

const detectIsPortal = (instance: unknown) => detectIsComponent(instance) && instance.token === $$portal;

const getPortalContainer = (fiber: Fiber<TagNativeElement>): TagNativeElement | null =>
  detectIsPortal(fiber.inst) ? fiber.element : null;

function unmountPortal(fiber: Fiber<TagNativeElement>) {
  const element = getPortalContainer(fiber);

  element && (element.textContent = '');
}

export { $$portal, detectIsPortal, unmountPortal };
