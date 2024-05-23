import type { Callback, AppResources, AppResource } from '../shared';
import { platform, detectIsServer } from '../platform';
import { type Fiber, Awaiter } from '../fiber';
import { Reconciler } from '../reconciler';
import { EventEmitter } from '../emitter';

class Scope {
  private root: Fiber = null;
  private wip: Fiber = null;
  private cursor: Fiber = null;
  private unit: Fiber = null;
  private mDeep = true;
  private mLevel = 0;
  private mNav: Record<number, number> = {};
  private events = new Map<string, WeakMap<object, Function>>();
  private unsubs = new Set<Callback>();
  private reconciler = new Reconciler();
  private candidates = new Set<Fiber>();
  private deletions = new Set<Fiber>();
  private cancels: Array<Callback> = [];
  private effects1 = new Set<Callback>(); // async effects
  private effects2 = new Set<Callback>(); // layout effects
  private effects3 = new Set<Callback>(); // insertion effects
  private resId = 0;
  private resources: AppResources = new Map();
  private awaiter = new Awaiter();
  private onTransitionEnd: Callback = null;
  private isEffect3 = false;
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

  getRoot() {
    return this.root;
  }

  setRoot(fiber: Fiber) {
    this.root = fiber;
  }

  keepRoot() {
    !this.isUpdate && this.setRoot(this.wip);
  }

  getWip() {
    return this.wip;
  }

  setWip(fiber: Fiber) {
    this.wip = fiber;
  }

  getNextUnit() {
    return this.unit;
  }

  setNextUnit(fiber: Fiber) {
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
    const idx = this.getMountIdx();

    if (idx === 0) {
      this.navToParent();
      this.setMountDeep(true);
    } else {
      this.mNav[this.mLevel] = this.mNav[this.mLevel] - 1;
      this.setMountDeep(false);
    }
  }

  getMountIdx() {
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

  addEventUnsub(fn: Callback) {
    this.unsubs.add(fn);
  }

  unsubscribe() {
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

  addEffect1(fn: Callback) {
    this.effects1.add(fn);
  }

  resetEffects1() {
    this.effects1 = new Set();
  }

  runEffects1() {
    if (!this.isDynamic) return;
    const effects = this.effects1;
    effects.size > 0 && setTimeout(() => effects.forEach(fn => fn()));
  }

  addEffect2(fn: Callback) {
    this.effects2.add(fn);
  }

  resetEffects2() {
    this.effects2 = new Set();
  }

  runEffects2() {
    if (!this.isDynamic) return;
    this.effects2.forEach(fn => fn());
  }

  addEffect3(fn: Callback) {
    this.effects3.add(fn);
  }

  resetEffects3() {
    this.effects3 = new Set();
  }

  runEffects3() {
    if (!this.isDynamic) return;
    this.setIsInsertionEffect(true);
    this.effects3.forEach(fn => fn());
    this.setIsInsertionEffect(false);
  }

  addCancel(fn: Callback) {
    this.cancels.push(fn);
  }

  applyCancels() {
    for (let i = this.cancels.length - 1; i >= 0; i--) this.cancels[i]();
  }

  resetCancels() {
    this.cancels = [];
  }

  getIsInsertionEffect() {
    return this.isEffect3;
  }

  setIsInsertionEffect(value: boolean) {
    this.isEffect3 = value;
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

  setOnTransitionEnd(fn: Callback) {
    this.onTransitionEnd = fn;
  }

  cleanup() {
    this.keepRoot(); // !
    this.setWip(null);
    this.setNextUnit(null);
    this.setCursor(null);
    this.resetMount();
    this.resetCandidates();
    this.resetDeletions();
    this.resetCancels();
    this.resetEffects3();
    this.resetEffects2();
    this.resetEffects1();
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

  getResourceId() {
    return this.resId;
  }

  setResourceId(id: number) {
    this.resId = id;
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

  getReconciler() {
    return this.reconciler;
  }

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
    scope.unsubs = this.unsubs;
    scope.reconciler = this.reconciler.fork();
    scope.candidates = new Set([...this.candidates]);
    scope.deletions = new Set([...this.deletions]);
    scope.effects1 = new Set([...this.effects1]);
    scope.effects2 = new Set([...this.effects2]);
    scope.isUpdate = this.isUpdate;
    scope.emitter = this.emitter;
    scope.awaiter = this.awaiter;

    return scope;
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
