import type { DarkElement, SlotProps } from '../shared';
import { __useCursor as useCursor } from '../internal';
import { component } from '../component';
import { Fragment } from '../fragment';
import { forwardRef } from '../ref';
import { Shadow } from '../shadow';

type SuspenseProps = {
  fallback?: DarkElement;
} & Required<SlotProps>;

const Suspense = forwardRef<SuspenseProps, unknown>(
  component(
    ({ fallback = null, slot }) => {
      const cursor = useCursor();
      const isPending = cursor.hook.isPending;
      const content = [
        isPending ? Fragment({ key: FALLBACK, slot: fallback }) : null,
        Shadow({ key: CONTENT, isOpen: !isPending, slot }),
      ].filter(Boolean);

      cursor.hook.isSuspense = true;

      return Fragment({ slot: content });
    },
    { displayName: 'Suspense' },
  ),
);

const CONTENT = 1;
const FALLBACK = 2;

export { Suspense };
