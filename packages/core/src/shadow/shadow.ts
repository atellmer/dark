import type { DarkElement } from '../shared';
import { component } from '../component';
import { SHADOW_MASK } from '../constants';
import { useLayoutEffect } from '../use-layout-effect';
import { $$scope } from '../scope';
import { collectElements, getFiberWithElement } from '../walk';
import { platform, detectIsServer } from '../platform';
import { $$shadow } from './utils';

type ShadowProps = {
  isInserted: boolean;
  slot: DarkElement;
};

const Shadow = component<ShadowProps>(
  ({ isInserted, slot }) => {
    const isEnabled = !detectIsServer() && !$$scope().getIsHydrateZone();
    const fiber = $$scope().getCursorFiber();

    if (isEnabled) {
      if (isInserted) {
        fiber.mask &= ~SHADOW_MASK;
      } else {
        !(fiber.mask & SHADOW_MASK) && (fiber.mask |= SHADOW_MASK);
      }
    }

    useLayoutEffect(() => {
      if (!isEnabled || !isInserted) return;
      const $fiber = getFiberWithElement(fiber);
      const fibers = collectElements(fiber, x => x);

      for (const fiber of fibers) {
        platform.insertElement(fiber.element, fiber.eidx, $fiber.element);
      }
    }, [isInserted]);

    return slot || null;
  },
  { token: $$shadow },
);

export { Shadow };
