import type { DarkElement } from '../shared';
import { component } from '../component';
import { MASK_SHADOW } from '../constants';
import { useLayoutEffect } from '../use-layout-effect';
import { $$scope } from '../scope';
import { collectElements, getFiberWithElement } from '../walk';
import { platform, detectIsServer } from '../platform';
import { $$shadow } from './utils';

type ShadowProps = {
  isVisible: boolean;
  slot: DarkElement;
};

const Shadow = component<ShadowProps>(
  ({ isVisible, slot }) => {
    const isEnabled = !detectIsServer() && !$$scope().getIsHydrateZone();
    const fiber = $$scope().getCursorFiber();

    if (isEnabled) {
      if (isVisible) {
        fiber.mask &= ~MASK_SHADOW;
      } else {
        fiber.mask |= MASK_SHADOW;
      }
    }

    useLayoutEffect(() => {
      if (!isEnabled || !isVisible) return;
      const $fiber = getFiberWithElement(fiber);
      const fibers = collectElements(fiber, x => x);

      for (const fiber of fibers) {
        platform.insertElement(fiber.element, fiber.eidx, $fiber.element);
      }
    }, [isVisible]);

    return slot || null;
  },
  { token: $$shadow },
);

export { Shadow };
