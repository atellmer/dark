import { type Fiber, type Hook } from '../fiber';
import { REJECTED_STATUS } from '../constants';
import { createError } from '../utils';

class Awaiter {
  store = new Map<Hook, [Hook, Hook, Set<Promise<unknown>>]>();

  add(suspense: Fiber, boundary: Fiber, promise: Promise<unknown>) {
    const key = suspense?.hook || boundary?.hook;
    !this.store.has(key) && this.store.set(key, [null, null, new Set()]);
    const data = this.store.get(key);

    data[0] = suspense?.hook || null;
    data[1] = boundary?.hook || null;
    data[2].add(promise);
  }

  resolve() {
    for (const [key, data] of this.store) {
      this.store.delete(key);
      const [suspenseHook, boundaryHook, promises] = data;
      let pendings = 0;

      if (promises.size === 0) continue;

      if (suspenseHook) {
        suspenseHook.setIsPeinding(true);
        suspenseHook.incrementPendings();
        pendings = suspenseHook.getPendings();
        suspenseHook.update();
      }

      Promise.allSettled(promises).then(res => {
        const hook =
          boundaryHook && suspenseHook
            ? boundaryHook.owner.id < suspenseHook.owner.id
              ? boundaryHook
              : suspenseHook
            : boundaryHook || suspenseHook;

        if (boundaryHook) {
          const rejected = res.find(x => x.status === REJECTED_STATUS) as PromiseRejectedResult;

          rejected && boundaryHook.owner.setError(createError(rejected.reason));
        }

        if (suspenseHook && pendings === suspenseHook.getPendings()) {
          suspenseHook.setIsPeinding(false);
        }

        hook.update();
      });
    }
  }
}

export { Awaiter };
