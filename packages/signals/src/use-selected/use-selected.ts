import { useUpdate, __useCursor as useCursor } from '@dark-engine/core';

import { type Signal } from '../signal';

function useSelected<T>(signal$: Signal<T>, key: T): T {
  const update = useUpdate();
  const cursor = useCursor();

  cursor.hook.createCleanup(signal$, () => signal$.__on(update, key));

  return signal$.peek();
}

export { useSelected };
