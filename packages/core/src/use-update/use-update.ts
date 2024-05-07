import { __useCursor as useCursor } from '../internal';
import { createUpdate } from '../workloop';
import { getRootId } from '../scope';

function useUpdate() {
  const rootId = getRootId();
  const cursor = useCursor();

  return createUpdate(rootId, cursor.hook);
}

export { createUpdate, useUpdate };
