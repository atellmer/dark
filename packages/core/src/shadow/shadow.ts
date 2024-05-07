import { __useCursor as useCursor, __useSSR as useSSR } from '../internal';
import { collectElements, getFiberWithElement } from '../walk';
import { useLayoutEffect } from '../use-layout-effect';
import type { DarkElement } from '../shared';
import { SHADOW_MASK } from '../constants';
import { component } from '../component';
import { platform } from '../platform';

const $$shadow = Symbol('shadow');

type ShadowProps = {
  isOpen: boolean;
  slot: DarkElement;
};

const Shadow = component<ShadowProps>(
  ({ isOpen, slot }) => {
    const { isSSR } = useSSR();
    const cursor = useCursor();

    if (!isSSR) {
      if (isOpen) {
        cursor.mask &= ~SHADOW_MASK;
      } else {
        cursor.mask |= SHADOW_MASK;
      }
    }

    useLayoutEffect(() => {
      if (isSSR) return;
      const $fiber = getFiberWithElement(cursor);
      const fibers = collectElements(cursor, x => x);


      console.log('$fiber', isOpen, $fiber, fibers, fibers[0].eidx);

      for (const fiber of fibers) {
        if (isOpen) {
          platform.insertElement(fiber.element, fiber.eidx, $fiber.element);
        } else {
          platform.removeElement(fiber.element, $fiber.element);
        }
      }
    }, [isOpen]);

    return slot;
  },
  { token: $$shadow, displayName: 'Shadow' },
);

export { Shadow };
