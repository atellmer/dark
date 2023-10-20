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

  public setupPorts() {
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

  public unrefPorts() {
    (this.channel as NodeMessageChannel).port1.unref();
    (this.channel as NodeMessageChannel).port2.unref();
  }

  public shouldYield() {
    return getTime() >= this.deadline;
  }

  public schedule(callback: Callback, options?: ScheduleCallbackOptions) {
    const {
      priority = TaskPriority.NORMAL,
      forceAsync = false,
      isTransition = false,
      createSign,
      setPendingStatus,
    } = options || {};
    const task = new Task(callback, priority, forceAsync);

    task.setIsTransition(isTransition);
    task.setPendingSetter(setPendingStatus);
    task.setSignCreator(createSign);
    this.put(task);
    this.execute();
  }

  public hasPrimaryTask() {
    if (this.task.getIsTransition()) {
      const { high, normal, low } = this.getQueues();
      const hasPrimary = high.length > 0 || normal.length > 0;

      if (hasPrimary) {
        const sign = this.task.createSign();
        const isMatch = Task.detectIsMatchSign(sign, high);

        if (isMatch) {
          this.task.markAsUnnecessary();
        }

        return true;
      }

      const sign = this.task.createSign();
      const hasSame = Task.detectHasSameSign(sign, low);

      if (hasSame) {
        this.task.markAsUnnecessary();

        return true;
      }
    }

    return false;
  }

  public cancelTask(fn: TaskRestorer) {
    if (this.task.getIsUnnecessary()) return this.completeTask(this.task);
    this.task.setTaskRestorer(fn);
    this.deferTransition(this.task);
  }

  public completeTask(task: Task) {
    task.pending(false);
  }

  private put(task: Task) {
    const queue = this.queue[task.getPriority()];

    queue.push(task);
  }

  private pick(queue: Array<Task>) {
    if (!queue.length) return false;
    this.task = queue.shift();

    if (this.task.getIsTransition()) {
      const sign = this.task.createSign();
      const hasSign = Task.detectHasSameSign(sign, queue);

      if (hasSign) {
        this.task = null;
        return this.pick(queue);
      }

      if (this.task.canPending()) {
        const task = this.task;

        task.markAsPending();
        this.deferTransition(this.task);
        this.task = null;

        nextTick(() => task.pending(true));

        return true;
      }
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
        this.completeTask(this.task);
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

  private deferTransition(task: Task) {
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
type SignCreator = () => string;

class Task {
  private id: number;
  private priority: TaskPriority;
  private forceAsync: boolean;
  private isTransition: boolean;
  private isPending: boolean;
  private isUnnecessary: boolean;
  private callback: TaskCallback;
  private taskRestorer?: TaskRestorer = null;
  private signCreator?: SignCreator;
  private pendingSetter?: SetPendingStatus = null;
  private static nextTaskId = 0;

  constructor(callback: TaskCallback, priority: TaskPriority, forceAsync: boolean) {
    this.id = ++Task.nextTaskId;
    this.callback = callback;
    this.priority = priority;
    this.forceAsync = forceAsync;
  }

  public getPriority() {
    return this.priority;
  }

  public getForceAsync() {
    return this.forceAsync;
  }

  public setIsTransition(value: boolean) {
    this.isTransition = value;
  }

  public getIsTransition() {
    return this.isTransition;
  }

  public run() {
    this.callback(this.taskRestorer);
    this.taskRestorer = null;
  }

  public pending(value: boolean) {
    this.isTransition && this.pendingSetter && this.pendingSetter(value);
  }

  public markAsPending() {
    this.isPending = true;
  }

  public canPending() {
    return !this.isPending && detectIsFunction(this.pendingSetter);
  }

  public markAsUnnecessary() {
    this.isUnnecessary = true;
  }

  public getIsUnnecessary() {
    return this.isUnnecessary;
  }

  public setTaskRestorer(fn: TaskRestorer) {
    this.taskRestorer = fn;
  }

  public setSignCreator(fn: SignCreator) {
    this.signCreator = fn;
  }

  public createSign() {
    return this.signCreator();
  }

  public setPendingSetter(fn: SetPendingStatus) {
    this.pendingSetter = fn;
  }

  public static detectHasSameSign(sign: string, tasks: Array<Task>) {
    return tasks.some(x => x.isTransition && x.createSign() === sign);
  }

  public static detectIsMatchSign(sign: string, tasks: Array<Task>) {
    return tasks.some(x => x.createSign && x.createSign().length > sign.length);
  }
}

const scheduler = new Scheduler();

if (process.env.NODE_ENV !== 'test') {
  scheduler.setupPorts();
}

export { scheduler };
