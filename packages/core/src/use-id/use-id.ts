import { useMemo } from '../use-memo';
import { getRootId } from '../scope';

function useId() {
  return useMemo(() => getNextId(getRootId()), []);
}

let nextId = 1000000;

const getNextId = (rootId: number) => `dark:${rootId}:${(++nextId).toString(36)}`;

export { useId };
