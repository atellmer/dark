import type { DarkElement } from '../shared';
import { component } from '../component';
import { useLayoutEffect } from '../use-layout-effect';
import { currentFiberStore, isHydrateZone } from '../scope';
import { collectElements, getFiberWithElement } from '../walk';
import { platform, detectIsServer } from '../platform';
import { $$shadow } from './utils';

type ShadowProps = {
  isVisible: boolean;
  slot: DarkElement;
};

const Shadow = component<ShadowProps>(
  ({ isVisible, slot }) => {
    const isEnabled = !detectIsServer() && !isHydrateZone.get();
    const fiber = currentFiberStore.get();

    if (isEnabled) {
      if (isVisible) {
        delete fiber.inv;
      } else {
        fiber.inv = true;
      }
    }

    useLayoutEffect(() => {
      if (!isEnabled || !isVisible) return;
      const fiber$ = getFiberWithElement(fiber);
      const fibers = collectElements(fiber, x => x);

      for (const fiber of fibers) {
        platform.insertElement(fiber.element, fiber.eidx, fiber$.element);
      }
    }, [isVisible]);

    return slot || null;
  },
  { token: $$shadow },
);

export { Shadow };
