import type { Callback, ElementKey, AppResources, AppResource } from '../shared';
import { platform, detectIsServer } from '../platform';
import { EventEmitter } from '../emitter';
import { type Fiber, Awaiter } from '../fiber';

class Scope {
  private root: Fiber = null;
  private wip: Fiber = null;
  private cursor: Fiber = null;
  private unit: Fiber = null;
  private mountDeep = true;
  private mountLevel = 0;
  private mountNav: Record<number, number> = {};
  private events = new Map<string, WeakMap<object, Function>>();
  private unsubs = new Set<Callback>();
  private actions: Actions = {};
  private candidates = new Set<Fiber>();
  private deletions = new Set<Fiber>();
  private cancels: Array<Callback> = [];
  private asyncEffects = new Set<Callback>();
  private layoutEffects = new Set<Callback>();
  private insertionEffects = new Set<Callback>();
  private resourceId = 0;
  private resources: AppResources = new Map();
  private awaiter: Awaiter = new Awaiter();
  private onTransitionEnd: Callback = null;
  private isLayoutEffectsZone = false;
  private isInsertionEffectsZone = false;
  private isUpdateZone = false;
  private isBatchZone = false;
  private isHydrateZone = false;
  private isStreamZone = false;
  private isTransitionZone = false;
  private isEventZone = false;
  private isHot = false;
  private isDynamic = platform.detectIsDynamic();
  private isServer = detectIsServer();
  private emitter = new EventEmitter();

  private resetActions() {
    this.actions = {};
  }

  getActionsById(id: number) {
    return this.actions[id];
  }

  addActionMap(id: number, map: Record<ElementKey, Fiber>) {
    this.actions[id] = {
      map,
      replace: null,
      insert: null,
      remove: null,
      move: null,
      stable: null,
    };
  }

  addReplaceAction(id: number, nextKey: ElementKey) {
    !this.actions[id].replace && (this.actions[id].replace = {});
    this.actions[id].replace[nextKey] = true;
  }

  addInsertAction(id: number, nextKey: ElementKey) {
    !this.actions[id].insert && (this.actions[id].insert = {});
    this.actions[id].insert[nextKey] = true;
  }

  addRemoveAction(id: number, prevKey: ElementKey) {
    !this.actions[id].remove && (this.actions[id].remove = {});
    this.actions[id].remove[prevKey] = true;
  }

  addMoveAction(id: number, nextKey: ElementKey) {
    !this.actions[id].move && (this.actions[id].move = {});
    this.actions[id].move[nextKey] = true;
  }

  addStableAction(id: number, nextKey: ElementKey) {
    !this.actions[id].stable && (this.actions[id].stable = {});
    this.actions[id].stable[nextKey] = true;
  }

  fork() {
    const scope = new Scope();

    scope.root = null;
    scope.wip = null;
    scope.cursor = null;
    scope.unit = this.unit;
    scope.mountDeep = this.mountDeep;
    scope.mountLevel = this.mountLevel;
    scope.mountNav = { ...this.mountNav };
    scope.events = this.events;
    scope.unsubs = this.unsubs;
    scope.actions = { ...this.actions };
    scope.candidates = new Set([...this.candidates]);
    scope.deletions = new Set([...this.deletions]);
    scope.asyncEffects = new Set([...this.asyncEffects]);
    scope.layoutEffects = new Set([...this.layoutEffects]);
    scope.isUpdateZone = this.isUpdateZone;
    scope.emitter = this.emitter;
    scope.awaiter = this.awaiter;

    return scope;
  }

  getRoot() {
    return this.root;
  }

  setRoot(fiber: Fiber) {
    this.root = fiber;
  }

  keepRoot() {
    !this.isUpdateZone && this.setRoot(this.wip);
  }

  getWorkInProgress() {
    return this.wip;
  }

  setWorkInProgress(fiber: Fiber) {
    this.wip = fiber;
  }

  getNextUnitOfWork() {
    return this.unit;
  }

  setNextUnitOfWork(fiber: Fiber) {
    this.unit = fiber;
  }

  getCursorFiber() {
    return this.cursor;
  }

  setCursorFiber(fiber: Fiber) {
    this.cursor = fiber;
  }

  navToChild() {
    this.mountLevel = this.mountLevel + 1;
    this.mountNav[this.mountLevel] = 0;
  }

  navToSibling() {
    this.mountNav[this.mountLevel] = this.mountNav[this.mountLevel] + 1;
  }

  navToParent() {
    this.mountLevel = this.mountLevel - 1;
  }

  navToPrev() {
    const idx = this.getMountIndex();

    if (idx === 0) {
      this.navToParent();
      this.setMountDeep(true);
    } else {
      this.mountNav[this.mountLevel] = this.mountNav[this.mountLevel] - 1;
      this.setMountDeep(false);
    }
  }

  getMountIndex() {
    return this.mountNav[this.mountLevel];
  }

  getMountDeep() {
    return this.mountDeep;
  }

  setMountDeep(value: boolean) {
    this.mountDeep = value;
  }

  resetMount() {
    this.mountLevel = 0;
    this.mountNav = {};
    this.mountDeep = true;
  }

  getEvents() {
    return this.events;
  }

  addEventUnsubscriber(fn: Callback) {
    this.unsubs.add(fn);
  }

  unsubscribeEvents() {
    this.unsubs.forEach(x => x());
    this.unsubs = new Set();
  }

  getCandidates() {
    return this.candidates;
  }

  addCandidate(fiber: Fiber) {
    this.candidates.add(fiber);
  }

  resetCandidates() {
    this.candidates = new Set();
  }

  getDeletions() {
    return this.deletions;
  }

  hasDeletion(fiber: Fiber) {
    let nextFiber = fiber;

    while (nextFiber) {
      if (this.deletions.has(nextFiber)) return true;
      nextFiber = nextFiber.parent;
    }

    return false;
  }

  addDeletion(fiber: Fiber) {
    !this.hasDeletion(fiber) && this.deletions.add(fiber);
  }

  resetDeletions() {
    this.deletions = new Set();
  }

  addAsyncEffect(fn: Callback) {
    this.asyncEffects.add(fn);
  }

  resetAsyncEffects() {
    this.asyncEffects = new Set();
  }

  runAsyncEffects() {
    if (!this.isDynamic) return;
    const effects = this.asyncEffects;
    effects.size > 0 && setTimeout(() => effects.forEach(fn => fn()));
  }

  addLayoutEffect(fn: Callback) {
    this.layoutEffects.add(fn);
  }

  resetLayoutEffects() {
    this.layoutEffects = new Set();
  }

  runLayoutEffects() {
    if (!this.isDynamic) return;
    this.setIsLayoutEffectsZone(true);
    this.layoutEffects.forEach(fn => fn());
    this.setIsLayoutEffectsZone(false);
  }

  addInsertionEffect(fn: Callback) {
    this.insertionEffects.add(fn);
  }

  resetInsertionEffects() {
    this.insertionEffects = new Set();
  }

  runInsertionEffects() {
    if (!this.isDynamic) return;
    this.setIsInsertionEffectsZone(true);
    this.insertionEffects.forEach(fn => fn());
    this.setIsInsertionEffectsZone(false);
  }

  addCancel(fn: Callback) {
    this.cancels.push(fn);
  }

  applyCancels() {
    for (let i = this.cancels.length - 1; i >= 0; i--) {
      this.cancels[i]();
    }
  }

  resetCancels() {
    this.cancels = [];
  }

  getIsLayoutEffectsZone() {
    return this.isLayoutEffectsZone;
  }

  setIsLayoutEffectsZone(value: boolean) {
    this.isLayoutEffectsZone = value;
  }

  getIsInsertionEffectsZone() {
    return this.isInsertionEffectsZone;
  }

  setIsInsertionEffectsZone(value: boolean) {
    this.isInsertionEffectsZone = value;
  }

  getIsUpdateZone() {
    return this.isUpdateZone;
  }

  setIsUpdateZone(value: boolean) {
    this.isUpdateZone = value;
  }

  getIsBatchZone() {
    return this.isBatchZone;
  }

  setIsBatchZone(value: boolean) {
    this.isBatchZone = value;
  }

  getIsHydrateZone() {
    return this.isHydrateZone;
  }

  setIsHydrateZone(value: boolean) {
    this.isHydrateZone = value;
  }

  getIsStreamZone() {
    return this.isStreamZone;
  }

  setIsStreamZone(value: boolean) {
    this.isStreamZone = value;
  }

  getIsTransitionZone() {
    return this.isTransitionZone;
  }

  setIsTransitionZone(value: boolean) {
    this.isTransitionZone = value;
  }

  getIsEventZone() {
    return this.isEventZone;
  }

  setIsEventZone(value: boolean) {
    this.isEventZone = value;
  }

  getIsHot() {
    return this.isHot;
  }

  setIsHot(value: boolean) {
    this.isHot = value;
  }

  getOnTransitionEnd() {
    return this.onTransitionEnd;
  }

  setOnTransitionEnd(fn: Callback) {
    this.onTransitionEnd = fn;
  }

  flush() {
    this.keepRoot(); // !
    this.setWorkInProgress(null);
    this.setNextUnitOfWork(null);
    this.setCursorFiber(null);
    this.resetMount();
    this.resetCandidates();
    this.resetDeletions();
    this.resetCancels();
    this.resetInsertionEffects();
    this.resetLayoutEffects();
    this.resetAsyncEffects();
    this.setIsHydrateZone(false);
    this.setIsUpdateZone(false);
    this.resetActions();
  }

  getEmitter() {
    return this.emitter;
  }

  getResource(id: number) {
    return this.resources.get(id);
  }

  setResource(id: number, res: AppResource) {
    this.resources.set(id, res);
  }

  getResources() {
    return this.resources;
  }

  getResourceId() {
    return this.resourceId;
  }

  setResourceId(id: number) {
    this.resourceId = id;
  }

  getNextResourceId() {
    return ++this.resourceId;
  }

  getAwaiter() {
    return this.awaiter;
  }

  runAfterCommit() {
    this.resources = new Map();
    this.isServer && (this.resourceId = 0);
  }
}

type Actions = Record<
  number,
  {
    map: Record<ElementKey, Fiber>;
    replace: Record<ElementKey, true>;
    insert: Record<ElementKey, true>;
    remove: Record<ElementKey, true>;
    move: Record<ElementKey, true>;
    stable: Record<ElementKey, true>;
  }
>;

let rootId: number = null;
const scopes = new Map<number, Scope>();

const getRootId = () => rootId;

const setRootId = (id: number) => {
  rootId = id;
  !scopes.has(rootId) && scopes.set(rootId, new Scope());
};

const removeScope = (id: number) => scopes.delete(id);

const replaceScope = (scope: Scope, id: number = rootId) => {
  Object.assign(scopes.get(id), scope);
};

const $$scope = (id: number = rootId) => scopes.get(id);

export { type Scope, getRootId, setRootId, removeScope, replaceScope, $$scope };
