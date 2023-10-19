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

type QueueMap = {
  high: Array<Task>;
  normal: Array<Task>;
  low: Array<Task>;
};

const queueMap: QueueMap = {
  high: [],
  normal: [],
  low: [],
};
const YIELD_INTERVAL = 4;
let scheduledCallback: WorkLoop = null;
let deadline = 0;
let isMessageLoopRunning = false;
let currentTask: Task = null;
let channel: MessageChannel | NodeMessageChannel = null;
let port: MessagePort | NodeMessagePort = null;

function setupPorts() {
  if (process.env.NODE_ENV === 'test') {
    const worker = require('node:worker_threads');

    channel = new worker.MessageChannel() as NodeMessageChannel;
    port = channel.port2;
    channel.port1.on('message', performWorkUntilDeadline);
    return;
  }

  channel = new MessageChannel() as MessageChannel;
  port = channel.port2;
  channel.port1.onmessage = performWorkUntilDeadline;
}

function unrefPorts() {
  (channel as NodeMessageChannel).port1.unref();
  (channel as NodeMessageChannel).port2.unref();
}

if (process.env.NODE_ENV !== 'test') {
  setupPorts();
}

type TaskConstructorOptions = Omit<Task, 'id' | 'isPending' | 'isCanceled'>;

class Task {
  public static nextTaskId = 0;
  public id: number;
  public isPending = false;
  public isCanceled = false;
  public priority: TaskPriority;
  public forceAsync: boolean;
  public isTransition: boolean;
  public callback: (restore?: (options: RestoreOptions) => void) => void;
  public restore?: (options: RestoreOptions) => void;
  public createSign?: () => string;
  public setPendingStatus?: SetPendingStatus;

  constructor(options: TaskConstructorOptions) {
    const { priority, forceAsync, isTransition, createSign, setPendingStatus, callback } = options;

    this.id = ++Task.nextTaskId;
    this.priority = priority;
    this.forceAsync = forceAsync;
    this.isTransition = isTransition;
    this.createSign = createSign;
    this.setPendingStatus = setPendingStatus;
    this.callback = callback;
  }
}

const shouldYield = () => getTime() >= deadline;

function scheduleCallback(callback: Callback, options?: ScheduleCallbackOptions) {
  const {
    priority = TaskPriority.NORMAL,
    forceAsync = false,
    isTransition = false,
    createSign,
    setPendingStatus,
  } = options || {};
  const task = new Task({ priority, forceAsync, isTransition, createSign, setPendingStatus, callback });

  put(task);
  execute();
}

const tasksMap: Record<TaskPriority, Array<Task>> = {
  [TaskPriority.HIGH]: queueMap.high,
  [TaskPriority.NORMAL]: queueMap.normal,
  [TaskPriority.LOW]: queueMap.low,
};

function put(task: Task) {
  const queue = tasksMap[task.priority];

  queue.push(task);
}

function pick(queue: Array<Task>) {
  if (!queue.length) return false;
  currentTask = queue.shift();

  if (currentTask.isTransition) {
    const sign = currentTask.createSign();
    const hasSign = detectHasSameSign(sign, queue);

    if (hasSign) {
      currentTask = null;
      return pick(queue);
    }

    if (!currentTask.isPending && detectIsFunction(currentTask.setPendingStatus)) {
      const setPendingStatus = currentTask.setPendingStatus;

      currentTask.isPending = true;
      queueMap.low.unshift(currentTask);
      currentTask = null;

      nextTick(() => setPendingStatus(true));

      return true;
    }
  }

  currentTask.callback(currentTask.restore);
  currentTask.restore && (currentTask.restore = null);
  currentTask.forceAsync ? requestCallbackAsync(workLoop) : requestCallback(workLoop);

  return true;
}

function execute() {
  const isBusy = detectIsBusy();

  if (!isBusy && !isMessageLoopRunning) {
    pick(queueMap.high) || pick(queueMap.normal) || pick(queueMap.low);
  }
}

function performWorkUntilDeadline() {
  if (scheduledCallback) {
    deadline = getTime() + YIELD_INTERVAL;
    const hasMoreWork = scheduledCallback(true);

    if (!hasMoreWork) {
      completeTask(currentTask);
      isMessageLoopRunning = false;
      scheduledCallback = null;
      currentTask = null;
      execute();
    } else {
      port.postMessage(null);
    }
  } else {
    isMessageLoopRunning = false;
  }
}

function requestCallbackAsync(callback: WorkLoop) {
  scheduledCallback = callback;

  if (!isMessageLoopRunning) {
    isMessageLoopRunning = true;
    port.postMessage(null);
  }
}

function requestCallback(callback: WorkLoop) {
  callback(false);
  currentTask = null;
  execute();
}

function detectHasSameSign(sign: string, queue: Array<Task>) {
  return queue.some(x => x.isTransition && x.createSign() === sign);
}

function detectIsMatchSign(sign: string, queue: Array<Task>) {
  return queue.some(x => x.createSign && x.createSign().length > sign.length);
}

function hasPrimaryTask() {
  if (currentTask.isTransition) {
    const hasPrimary = queueMap.high.length > 0 || queueMap.normal.length > 0;

    if (hasPrimary) {
      const sign = currentTask.createSign();
      const isMatch = detectIsMatchSign(sign, queueMap.high);

      if (isMatch) {
        currentTask.isCanceled = true;
      }

      return true;
    }
    const sign = currentTask.createSign();
    const hasSign = detectHasSameSign(sign, queueMap.low);

    if (hasSign) {
      currentTask.isCanceled = true;

      return true;
    }
  }

  return false;
}

function cancelTask(restore: (options: RestoreOptions) => void) {
  if (currentTask.isCanceled) return completeTask(currentTask);
  currentTask.restore = restore;
  queueMap.low.unshift(currentTask);
}

function completeTask(task: Task) {
  task.isTransition && detectIsFunction(task.setPendingStatus) && task.setPendingStatus(false);
}

export { shouldYield, scheduleCallback, hasPrimaryTask, cancelTask, setupPorts, unrefPorts };
