import type { DarkElement } from '../shared';
import { component } from '../component';
import { useLayoutEffect } from '../use-layout-effect';
import { currentFiberStore } from '../scope';
import { collectElements, getFiberWithElement } from '../walk';
import { platform } from '../platform';
import { $$shadow } from './utils';

type ShadowProps = {
  isEnabled: boolean;
  isVisible: boolean;
  slot: DarkElement;
};

const Shadow = component<ShadowProps>(
  ({ isEnabled, isVisible, slot }) => {
    const fiber = currentFiberStore.get();

    if (isVisible) {
      delete fiber.inv;
    } else {
      fiber.inv = true;
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
