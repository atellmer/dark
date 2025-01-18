import type { Callback, AppResources, AppResource } from '../shared';
import { platform, detectIsServer } from '../platform';
import { type OnTransitionEnd } from '../scheduler';
import { Reconciler } from '../reconciler';
import { EventEmitter } from '../emitter';
import { type Fiber } from '../fiber';
import { Awaiter } from '../awaiter';

class Scope {
  private root: Fiber = null;
  private wip: Fiber = null;
  private cursor: Fiber = null;
  private unit: Fiber = null;
  private mDeep = true;
  private mLevel = 0;
  private mNav: Record<number, number> = {};
  private events = new Map<string, WeakMap<object, Function>>();
  private offs = new Set<Callback>();
  private reconciler = new Reconciler();
  private candidates = new Set<Fiber>();
  private deletions = new Set<Fiber>();
  private cancels: Array<Callback> = [];
  private asyncEffects = new Set<Callback>();
  private layoutEffects = new Set<Callback>();
  private insertionEffects = new Set<Callback>();
  private resId = 0;
  private resources: AppResources = new Map();
  private awaiter = new Awaiter();
  private onTransitionEnd: OnTransitionEnd = null;
  private isLayoutEffect = false;
  private isInsertionEffect = false;
  private isUpdate = false;
  private isBatch = false;
  private isHydration = false;
  private isStream = false;
  private isTransition = false;
  private isEvent = false;
  private isHot = false;
  private isDynamic = platform.detectIsDynamic();
  private isServer = detectIsServer();
  private emitter = new EventEmitter();

  fork() {
    const scope = new Scope();

    scope.root = null;
    scope.wip = null;
    scope.cursor = null;
    scope.unit = this.unit;
    scope.mDeep = this.mDeep;
    scope.mLevel = this.mLevel;
    scope.mNav = { ...this.mNav };
    scope.events = this.events;
    scope.offs = this.offs;
    scope.reconciler = this.reconciler.fork();
    scope.candidates = new Set([...this.candidates]);
    scope.deletions = new Set([...this.deletions]);
    scope.asyncEffects = new Set([...this.asyncEffects]);
    scope.layoutEffects = new Set([...this.layoutEffects]);
    scope.isUpdate = this.isUpdate;
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
    !this.isUpdate && this.setRoot(this.wip);
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

  setUnitOfWork(fiber: Fiber) {
    this.unit = fiber;
  }

  getCursor() {
    return this.cursor;
  }

  setCursor(fiber: Fiber) {
    this.cursor = fiber;
  }

  navToChild() {
    this.mLevel = this.mLevel + 1;
    this.mNav[this.mLevel] = 0;
  }

  navToSibling() {
    this.mNav[this.mLevel] = this.mNav[this.mLevel] + 1;
  }

  navToParent() {
    this.mLevel = this.mLevel - 1;
  }

  navToPrev() {
    const idx = this.getMountIndex();

    if (idx === 0) {
      this.navToParent();
      this.setMountDeep(true);
    } else {
      this.mNav[this.mLevel] = this.mNav[this.mLevel] - 1;
      this.setMountDeep(false);
    }
  }

  getMountIndex() {
    return this.mNav[this.mLevel];
  }

  getMountDeep() {
    return this.mDeep;
  }

  setMountDeep(value: boolean) {
    this.mDeep = value;
  }

  resetMount() {
    this.mLevel = 0;
    this.mNav = {};
    this.mDeep = true;
  }

  getEvents() {
    return this.events;
  }

  addOff(fn: Callback) {
    this.offs.add(fn);
  }

  off() {
    this.offs.forEach(x => x());
    this.offs = new Set();
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
    this.setIsLayoutEffect(true);
    this.layoutEffects.forEach(fn => fn());
    this.setIsLayoutEffect(false);
  }

  addInsertionEffect(fn: Callback) {
    this.insertionEffects.add(fn);
  }

  resetInsertionEffects() {
    this.insertionEffects = new Set();
  }

  runInsertionEffects() {
    if (!this.isDynamic) return;
    this.setIsInsertionEffect(true);
    this.insertionEffects.forEach(fn => fn());
    this.setIsInsertionEffect(false);
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

  getIsLayoutEffect() {
    return this.isLayoutEffect;
  }

  setIsLayoutEffect(value: boolean) {
    this.isLayoutEffect = value;
  }

  getIsInsertionEffect() {
    return this.isInsertionEffect;
  }

  setIsInsertionEffect(value: boolean) {
    this.isInsertionEffect = value;
  }

  getIsUpdate() {
    return this.isUpdate;
  }

  setIsUpdate(value: boolean) {
    this.isUpdate = value;
  }

  getIsBatch() {
    return this.isBatch;
  }

  setIsBatch(value: boolean) {
    this.isBatch = value;
  }

  getIsHydration() {
    return this.isHydration;
  }

  setIsHydration(value: boolean) {
    this.isHydration = value;
  }

  getIsStream() {
    return this.isStream;
  }

  setIsStream(value: boolean) {
    this.isStream = value;
  }

  getIsTransition() {
    return this.isTransition;
  }

  setIsTransition(value: boolean) {
    this.isTransition = value;
  }

  getIsEvent() {
    return this.isEvent;
  }

  setIsEvent(value: boolean) {
    this.isEvent = value;
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

  setOnTransitionEnd(fn: OnTransitionEnd) {
    this.onTransitionEnd = fn;
  }

  getReconciler() {
    return this.reconciler;
  }

  cleanup() {
    this.keepRoot(); // !
    this.setWorkInProgress(null);
    this.setUnitOfWork(null);
    this.setCursor(null);
    this.resetMount();
    this.resetCandidates();
    this.resetDeletions();
    this.resetCancels();
    this.resetInsertionEffects();
    this.resetLayoutEffects();
    this.resetAsyncEffects();
    this.setIsHydration(false);
    this.setIsUpdate(false);
    this.reconciler.reset();
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

  getNextResourceId() {
    return ++this.resId;
  }

  getAwaiter() {
    return this.awaiter;
  }

  runAfterCommit() {
    this.resources = new Map();
    this.isServer && (this.resId = 0);
  }
}

let rootId: number = null;
const scopes = new Map<number, Scope>();

const getRootId = () => rootId;

const setRootId = (id: number) => {
  rootId = id;
  !scopes.has(rootId) && scopes.set(rootId, new Scope());
};

const removeScope = (id: number) => scopes.delete(id);

const replaceScope = (scope: Scope, id: number = rootId) => Object.assign(scopes.get(id), scope);

const $$scope = (id: number = rootId) => scopes.get(id);

export { type Scope, getRootId, setRootId, removeScope, replaceScope, $$scope };
