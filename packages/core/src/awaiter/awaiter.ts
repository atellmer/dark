import { type Hook } from '../fiber';

class Awaiter {
  store = new Map<Hook, Set<Promise<unknown>>>();

  add(hook: Hook, promise: Promise<unknown>) {
    !this.store.has(hook) && this.store.set(hook, new Set());
    this.store.get(hook).add(promise);
  }

  resolve(cb: (hook: Hook) => void) {
    for (const [hook, promises] of this.store) {
      this.store.delete(hook);

      if (promises.size > 0) {
        hook.setIsPeinding(true);
        hook.incrementPending();
        const pendings = hook.getPendings();
        cb(hook);

        Promise.allSettled(promises).then(() => {
          if (pendings === hook.getPendings()) {
            hook.setIsPeinding(false);
            cb(hook);
          }
        });
      }
    }
  }
}

export { Awaiter };
