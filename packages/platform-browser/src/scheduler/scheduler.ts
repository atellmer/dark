import { type MessagePort as NodeMessagePort, type MessageChannel as NodeMessageChannel } from 'node:worker_threads';
import {
  type ScheduleCallbackOptions,
  type WorkLoop,
  type Callback,
  type RestoreOptions,
  type SetPendingStatus,
  getTime,
  workLoop,
  TaskPriority,
  detectIsBusy,
  detectIsFunction,
  nextTick,
  HOOK_DELIMETER,
  ROOT,
} from '@dark-engine/core';

import { YIELD_INTERVAL } from '../constants';

class Scheduler {
  private queue: Record<TaskPriority, Array<Task>> = {
    [TaskPriority.HIGH]: [],
    [TaskPriority.NORMAL]: [],
    [TaskPriority.LOW]: [],
  };
  private deadline = 0;
  private task: Task = null;
  private scheduledCallback: WorkLoop = null;
  private isMessageLoopRunning = false;
  private channel: MessageChannel | NodeMessageChannel = null;
  private port: MessagePort | NodeMessagePort = null;

  setupPorts() {
    if (process.env.NODE_ENV === 'test') {
      const worker = require('node:worker_threads');

      this.channel = new worker.MessageChannel() as NodeMessageChannel;
      this.port = this.channel.port2;
      this.channel.port1.on('message', this.performWorkUntilDeadline.bind(this));
      return;
    }

    this.channel = new MessageChannel() as MessageChannel;
    this.port = this.channel.port2;
    this.channel.port1.onmessage = this.performWorkUntilDeadline.bind(this);
  }

  unrefPorts() {
    (this.channel as NodeMessageChannel).port1.unref();
    (this.channel as NodeMessageChannel).port2.unref();
  }

  shouldYield() {
    return getTime() >= this.deadline;
  }

  schedule(callback: Callback, options?: ScheduleCallbackOptions) {
    const {
      priority = TaskPriority.NORMAL,
      forceAsync = false,
      isTransition = false,
      createLocation,
      setPendingStatus,
    } = options || {};
    const task = new Task(callback, priority, forceAsync);

    task.setIsTransition(isTransition);
    task.setPendingSetter(setPendingStatus);
    task.setLocationCreator(createLocation || createRootLocation);
    this.put(task);
    this.execute();
  }

  hasPrimaryTask() {
    if (!this.task.getIsTransition()) return false;
    const { high, normal, low } = this.getQueues();
    const hasPrimary = high.length > 0 || normal.length > 0;
    const hasLow = low.length > 0;

    if (hasPrimary || hasLow) {
      const loc = this.task.createLocation();

      if (hasPrimary) {
        const has = Task.detectHasChildUpdate(loc, [...high, ...normal]);

        if (has) {
          this.task.markAsUnnecessary();
        }

        return true;
      }

      if (hasLow) {
        const has = Task.detectHasSameUpdate(loc, low);

        if (has) {
          this.task.markAsUnnecessary();

          return true;
        }
      }
    }

    return false;
  }

  cancelTask(fn: TaskRestorer) {
    if (this.task.getIsUnnecessary()) return this.complete(this.task);
    this.task.setTaskRestorer(fn);
    this.defer(this.task);
  }

  private complete(task: Task) {
    task.pending(false);
  }

  private put(task: Task) {
    const queue = this.queue[task.getPriority()];

    queue.push(task);
  }

  private pick(queue: Array<Task>) {
    if (queue.length === 0) return false;
    this.task = queue.shift();

    if (this.task.getIsTransition() && this.task.canPending()) {
      const task = this.task;

      task.markAsPending();
      this.defer(this.task);
      this.task = null;

      nextTick(() => task.pending(true));

      return true;
    }

    this.task.run();
    this.task.getForceAsync() ? this.requestCallbackAsync(workLoop) : this.requestCallback(workLoop);

    return true;
  }

  private execute() {
    const isBusy = detectIsBusy();
    const { high, normal, low } = this.getQueues();

    if (!isBusy && !this.isMessageLoopRunning) {
      this.pick(high) || this.pick(normal) || this.pick(low);
    }
  }

  private requestCallbackAsync(callback: WorkLoop) {
    this.scheduledCallback = callback;

    if (!this.isMessageLoopRunning) {
      this.isMessageLoopRunning = true;
      this.port.postMessage(null);
    }
  }

  private requestCallback(callback: WorkLoop) {
    callback(false);
    this.task = null;
    this.execute();
  }

  private performWorkUntilDeadline() {
    if (this.scheduledCallback) {
      this.deadline = getTime() + YIELD_INTERVAL;
      const hasMoreWork = this.scheduledCallback(true);

      if (!hasMoreWork) {
        this.complete(this.task);
        this.isMessageLoopRunning = false;
        this.scheduledCallback = null;
        this.task = null;
        this.execute();
      } else {
        this.port.postMessage(null);
      }
    } else {
      this.isMessageLoopRunning = false;
    }
  }

  private defer(task: Task) {
    const { low } = this.getQueues();

    low.unshift(task);
  }

  private getQueues() {
    const high = this.queue[TaskPriority.HIGH];
    const normal = this.queue[TaskPriority.NORMAL];
    const low = this.queue[TaskPriority.LOW];

    return {
      high,
      normal,
      low,
    };
  }
}

type TaskCallback = (fn: TaskRestorer) => void;
type TaskRestorer = (options: RestoreOptions) => void;
type LocationCreator = () => string;

class Task {
  private id: number;
  private priority: TaskPriority;
  private forceAsync: boolean;
  private isTransition: boolean;
  private isPending: boolean;
  private isUnnecessary: boolean;
  private callback: TaskCallback;
  private taskRestorer?: TaskRestorer = null;
  private locationCreator?: LocationCreator;
  private pendingSetter?: SetPendingStatus = null;
  private static nextTaskId = 0;

  constructor(callback: TaskCallback, priority: TaskPriority, forceAsync: boolean) {
    this.id = ++Task.nextTaskId;
    this.callback = callback;
    this.priority = priority;
    this.forceAsync = forceAsync;
  }

  getPriority() {
    return this.priority;
  }

  getForceAsync() {
    return this.forceAsync;
  }

  setIsTransition(value: boolean) {
    this.isTransition = value;
  }

  getIsTransition() {
    return this.isTransition;
  }

  run() {
    this.callback(this.taskRestorer);
    this.taskRestorer = null;
  }

  pending(value: boolean) {
    this.isTransition && this.pendingSetter && this.pendingSetter(value);
  }

  markAsPending() {
    this.isPending = true;
  }

  canPending() {
    return !this.isPending && detectIsFunction(this.pendingSetter);
  }

  markAsUnnecessary() {
    this.isUnnecessary = true;
  }

  getIsUnnecessary() {
    return this.isUnnecessary;
  }

  setTaskRestorer(fn: TaskRestorer) {
    this.taskRestorer = fn;
  }

  setLocationCreator(fn: LocationCreator) {
    this.locationCreator = fn;
  }

  createLocation() {
    return this.locationCreator();
  }

  setPendingSetter(fn: SetPendingStatus) {
    this.pendingSetter = fn;
  }

  static detectHasSameUpdate(loc: string, tasks: Array<Task>) {
    return tasks.some(x => {
      const $loc = x.createLocation();
      const has = $loc === loc;

      return has;
    });
  }

  static detectHasChildUpdate(loc: string, tasks: Array<Task>) {
    const [$loc] = loc.split(HOOK_DELIMETER);

    return tasks.some(x => {
      const $$loc = x.createLocation();
      const has = $$loc.length > loc.length && $$loc.indexOf($loc) !== -1;

      return has;
    });
  }
}

const createRootLocation: LocationCreator = () => ROOT;

const scheduler = new Scheduler();

if (process.env.NODE_ENV !== 'test') {
  scheduler.setupPorts();
}

export { scheduler };
