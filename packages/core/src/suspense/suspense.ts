import type { DarkElement, SlotProps } from '../shared';
import { __useCursor as useCursor } from '../internal';
import { useUpdate } from '../use-update';
import { component } from '../component';
import { Fragment } from '../fragment';
import { Shadow } from '../shadow';

type SuspenseProps = {
  fallback?: DarkElement;
} & Required<SlotProps>;

const Suspense = component<SuspenseProps>(
  ({ fallback = null, slot }) => {
    const cursor = useCursor();
    const update = useUpdate();
    const isPending = cursor.hook.getIsPending();
    const content = [
      isPending ? Fragment({ key: 1, slot: fallback }) : null,
      Shadow({ key: 2, isOpen: !isPending, slot }),
    ].filter(Boolean);

    cursor.hook.setIsSuspense(true);
    cursor.hook.setUpdate(update);

    return Fragment({ slot: content });
  },
  { displayName: 'Suspense' },
);

export { Suspense };
