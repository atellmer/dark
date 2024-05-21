import { detectIsEmpty, createIndexKey, logError, formatErrorMsg } from '../utils';
import { type ElementKey as Key, type Instance } from '../shared';
import { tryOptStaticSlot, tryOptMemoSlot } from '../walk';
import { Flag, FLUSH_MASK } from '../constants';
import { type Fiber } from '../fiber';
import { type Scope } from '../scope';
import {
  type CanHaveChildren,
  detectAreSameInstanceTypes,
  hasChildrenProp,
  hasElementFlag,
  getElementKey,
} from '../view';

class Reconciler {
  private store: Record<number, Store>;

  constructor(store: Reconciler['store'] = {}) {
    this.store = store;
  }

  get(id: number) {
    return this.store[id];
  }

  reset() {
    this.store = {};
  }

  fork() {
    return new Reconciler({ ...this.store });
  }

  reconcile(fiber: Fiber, alt: Fiber, $scope: Scope) {
    const { id, inst } = fiber;
    const areSameTypes = detectAreSameInstanceTypes(alt.inst, inst);
    const nextChildren = (inst as CanHaveChildren).children;

    if (!areSameTypes) {
      $scope.addDeletion(alt);
    } else if (hasChildrenProp(alt.inst) && nextChildren && alt.cc !== 0) {
      const hasSameCount = alt.cc === nextChildren.length;
      const check = hasElementFlag(inst, Flag.SKIP_SCAN_OPT) ? !hasSameCount : true;

      if (check) {
        const { prevKeys, nextKeys, prevKeysMap, nextKeysMap, keyedFibersMap } = extractKeys(alt.child, nextChildren);
        const flush = nextKeys.length === 0;
        let size = Math.max(prevKeys.length, nextKeys.length);
        let p = 0;
        let n = 0;

        this.createStore(id, keyedFibersMap);

        for (let i = 0; i < size; i++) {
          const nextKey = nextKeys[i - n] ?? null;
          const prevKey = prevKeys[i - p] ?? null;
          const prevKeyFiber = keyedFibersMap[prevKey] || null;

          if (nextKey !== prevKey) {
            if (nextKey !== null && !prevKeysMap[nextKey]) {
              if (prevKey !== null && !nextKeysMap[prevKey]) {
                this.replace(id, nextKey);
                $scope.addDeletion(prevKeyFiber);
              } else {
                this.insert(id, nextKey);
                p++;
                size++;
              }
            } else if (!nextKeysMap[prevKey]) {
              this.remove(id, prevKey);
              $scope.addDeletion(prevKeyFiber);
              flush && (prevKeyFiber.mask |= FLUSH_MASK);
              n++;
              size++;
            } else if (nextKeysMap[prevKey] && nextKeysMap[nextKey]) {
              this.move(id, nextKey);
            }
          } else if (nextKey !== null) {
            this.stable(id, nextKey);
          }
        }

        hasElementFlag(inst, Flag.STATIC_SLOT_OPT) && tryOptStaticSlot(fiber, alt, $scope);
        hasElementFlag(inst, Flag.MEMO_SLOT_OPT) && tryOptMemoSlot(fiber, alt, $scope);
      }
    }
  }

  private createStore(id: number, map: Record<Key, Fiber>) {
    this.store[id] = {
      map,
      replace: null,
      insert: null,
      remove: null,
      move: null,
      stable: null,
    };
  }

  private replace(id: number, nextKey: Key) {
    !this.store[id].replace && (this.store[id].replace = {});
    this.store[id].replace[nextKey] = true;
  }

  private insert(id: number, nextKey: Key) {
    !this.store[id].insert && (this.store[id].insert = {});
    this.store[id].insert[nextKey] = true;
  }

  private remove(id: number, prevKey: Key) {
    !this.store[id].remove && (this.store[id].remove = {});
    this.store[id].remove[prevKey] = true;
  }

  private move(id: number, nextKey: Key) {
    !this.store[id].move && (this.store[id].move = {});
    this.store[id].move[nextKey] = true;
  }

  private stable(id: number, nextKey: Key) {
    !this.store[id].stable && (this.store[id].stable = {});
    this.store[id].stable[nextKey] = true;
  }
}

function extractKeys(alt: Fiber, children: Array<Instance>) {
  let nextFiber = alt;
  let idx = 0;
  const prevKeys: Array<Key> = [];
  const nextKeys: Array<Key> = [];
  const prevKeysMap: Record<Key, boolean> = {};
  const nextKeysMap: Record<Key, boolean> = {};
  const keyedFibersMap: Record<Key, Fiber> = {};
  const usedKeysMap: Record<Key, boolean> = {};

  while (nextFiber || idx < children.length) {
    if (nextFiber) {
      const key = getElementKey(nextFiber.inst);
      const prevKey = detectIsEmpty(key) ? createIndexKey(idx) : key;

      if (!prevKeysMap[prevKey]) {
        prevKeysMap[prevKey] = true; // !
        prevKeys.push(prevKey);
      }

      keyedFibersMap[prevKey] = nextFiber;
    }

    if (idx < children.length) {
      const inst = children[idx];
      const key = getElementKey(inst);
      const nextKey = detectIsEmpty(key) ? createIndexKey(idx) : key;

      if (process.env.NODE_ENV !== 'production') {
        if (usedKeysMap[nextKey]) {
          logError(formatErrorMsg(`The key of node [${nextKey}] already has been used!`), [inst]);
        }
      }

      if (!nextKeysMap[nextKey]) {
        nextKeysMap[nextKey] = true; // !
        nextKeys.push(nextKey);
      }

      usedKeysMap[nextKey] = true;
    }

    nextFiber = nextFiber ? nextFiber.next : null;
    idx++;
  }

  return {
    prevKeys,
    nextKeys,
    prevKeysMap,
    nextKeysMap,
    keyedFibersMap,
  };
}

type Store = {
  map: Record<Key, Fiber>;
  replace: Record<Key, true>;
  insert: Record<Key, true>;
  remove: Record<Key, true>;
  move: Record<Key, true>;
  stable: Record<Key, true>;
};

export { Reconciler };
