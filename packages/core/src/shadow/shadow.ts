import { __useCursor as useCursor, __useSSR as useSSR } from '../internal';
import { useLayoutEffect } from '../use-layout-effect';
import { detectIsTagVirtualNode } from '../view';
import type { DarkElement } from '../shared';
import { collectElements } from '../walk';
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

    useLayoutEffect(() => {
      if (isSSR) return;
      const fibers = collectElements(cursor, x => x);

      for (const fiber of fibers) {
        if (detectIsTagVirtualNode(fiber.inst)) {
          platform.toggle(fiber.el, isOpen);
        }
      }
    }, [isOpen]);

    return slot;
  },
  { token: $$shadow, displayName: 'Shadow' },
);

export { Shadow };
