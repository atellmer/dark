import type { Fiber } from '../fiber';
import type { Callback } from '../shared';

class Scope {
  private root: Fiber = null;
  private wip: Fiber = null;
  private unit: Fiber = null;
  private cursor: Fiber = null;
  private mountLevel = 0;
  private mountNav: Record<number, number> = {};
  private mountDeep = true;
  private events: Map<string, WeakMap<object, Function>> = new Map();
  private unsubscribers: Array<Callback> = [];
  private candidates: Set<Fiber> = new Set();
  private deletions: Set<Fiber> = new Set();
  private batchQueue: Array<Callback> = [];
  private batchUpdate: Callback = null;
  private aEffects: Array<Callback> = [];
  private lEffects: Array<Callback> = [];
  private iEffects: Array<Callback> = [];
  private cancels: Array<Callback> = [];
  private islEffZone = false;
  private isIEffZone = false;
  private isUpdateZone = false;
  private isBatchZone = false;
  private isHydrateZone = false;
  private isStreamZone = false;
  private isTransitionZone = false;
  private isHot = false;

  public getRoot() {
    return this.root;
  }

  public setRoot(fiber: Fiber) {
    this.root = fiber;
  }

  public getWorkInProgress() {
    return this.wip;
  }

  public setWorkInProgress(fiber: Fiber) {
    this.wip = fiber;
  }

  public getNextUnitOfWork() {
    return this.unit;
  }

  public setNextUnitOfWork(fiber: Fiber) {
    this.unit = fiber;
  }

  public getCursorFiber() {
    return this.cursor;
  }

  public setCursorFiber(fiber: Fiber) {
    this.cursor = fiber;
  }

  public navToChild() {
    this.mountLevel = this.mountLevel + 1;
    this.mountNav[this.mountLevel] = 0;
  }

  public navToSibling() {
    this.mountNav[this.mountLevel] = this.mountNav[this.mountLevel] + 1;
  }

  public navToParent() {
    this.mountNav[this.mountLevel] = 0;
    this.mountLevel = this.mountLevel - 1;
  }

  public getMountIndex() {
    return this.mountNav[this.mountLevel];
  }

  public getMountDeep() {
    return this.mountDeep;
  }

  public setMountDeep(value: boolean) {
    this.mountDeep = value;
  }

  public resetMount() {
    this.mountLevel = 0;
    this.mountNav = {};
    this.mountDeep = true;
  }

  public getEvents() {
    return this.events;
  }

  public addEventUnsubscriber(fn: Callback) {
    this.unsubscribers.push(fn);
  }

  public unsubscribeEvents() {
    this.unsubscribers.forEach(x => x());
  }

  public getCandidates() {
    return this.candidates;
  }

  public addCandidate(fiber: Fiber) {
    this.candidates.add(fiber);
  }

  public resetCandidates() {
    this.candidates = new Set();
  }

  public getDeletions() {
    return this.deletions;
  }

  public addDeletion(fiber: Fiber) {
    this.deletions.add(fiber);
  }

  public hasDeletion(fiber: Fiber) {
    return this.deletions.has(fiber);
  }

  public resetDeletions() {
    this.deletions = new Set();
  }

  public addBatch(fn: Callback) {
    this.batchQueue.push(fn);
  }

  public setBatchUpdate(fn: Callback) {
    this.batchUpdate = fn;
  }

  public applyBatch() {
    this.batchQueue.forEach(x => x());
    this.batchUpdate && this.batchUpdate();
    this.batchQueue = [];
    this.batchUpdate = null;
  }

  public getAEffecs() {
    return this.aEffects;
  }

  public addAEffect(fn: Callback) {
    this.aEffects.push(fn);
  }

  public resetAEffects() {
    this.aEffects = [];
  }

  public getLEffecs() {
    return this.lEffects;
  }

  public addLEffect(fn: Callback) {
    this.lEffects.push(fn);
  }

  public resetLEffects() {
    this.lEffects = [];
  }

  public getIEffecs() {
    return this.iEffects;
  }

  public addIEffect(fn: Callback) {
    this.iEffects.push(fn);
  }

  public resetIEffects() {
    this.iEffects = [];
  }

  public addCancel(fn: Callback) {
    this.cancels.push(fn);
  }

  public applyCancels() {
    for (let i = this.cancels.length - 1; i >= 0; i--) {
      this.cancels[i]();
    }
  }

  public resetCancels() {
    this.cancels = [];
  }

  public getIsLEffZone() {
    return this.islEffZone;
  }

  public setIsLEffZone(value: boolean) {
    this.islEffZone = value;
  }

  public getIsIEffZone() {
    return this.isIEffZone;
  }

  public setIsIEffZone(value: boolean) {
    this.isIEffZone = value;
  }

  public getIsUpdateZone() {
    return this.isUpdateZone;
  }

  public setIsUpdateZone(value: boolean) {
    this.isUpdateZone = value;
  }

  public getIsBatchZone() {
    return this.isBatchZone;
  }

  public setIsBatchZone(value: boolean) {
    this.isBatchZone = value;
  }

  public getIsHydrateZone() {
    return this.isHydrateZone;
  }

  public setIsHydrateZone(value: boolean) {
    this.isHydrateZone = value;
  }

  public getIsStreamZone() {
    return this.isStreamZone;
  }

  public setIsStreamZone(value: boolean) {
    this.isStreamZone = value;
  }

  public getIsTransitionZone() {
    return this.isTransitionZone;
  }

  public setIsTransitionZone(value: boolean) {
    this.isTransitionZone = value;
  }

  public getIsHot() {
    return this.isHot;
  }

  public setIsHot(value: boolean) {
    this.isHot = value;
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

const scope$$ = (id: number = rootId) => scopes.get(id);

export { type Scope, getRootId, setRootId, removeScope, scope$$ };
