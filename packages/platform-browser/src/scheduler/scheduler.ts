import { type MessagePort as NodeMessagePort, MessageChannel as NodeMessageChannel } from 'node:worker_threads';
import {
  type ScheduleCallbackOptions,
  type WorkLoop,
  type Callback,
  type RestoreOptions,
  getTime,
  workLoop,
  TaskPriority,
  detectIsBusy,
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
const IS_TEST_ENV = process.env.NODE_ENV === 'test';
const YIELD_INTERVAL = 4;
let scheduledCallback: WorkLoop = null;
let deadline = 0;
let isMessageLoopRunning = false;
let currentTask: Task = null;
let channel: MessageChannel | NodeMessageChannel = null;
let port: MessagePort | NodeMessagePort = null;

function setupPorts() {
  if (IS_TEST_ENV) {
    const worker = require('node:worker_threads');

    channel = new worker.MessageChannel() as NodeMessageChannel;
    port = channel.port2;
    channel.port1.on('message', performWorkUntilDeadline);
  } else {
    channel = new MessageChannel() as MessageChannel;
    port = channel.port2;
    channel.port1.onmessage = performWorkUntilDeadline;
  }
}

function unrefPorts() {
  (channel as NodeMessageChannel).port1.unref();
  (channel as NodeMessageChannel).port2.unref();
}

if (!IS_TEST_ENV) {
  setupPorts();
}

type TaskConstructorOptions = Omit<Task, 'id'>;

class Task {
  public static nextTaskId = 0;
  public id: number;
  public priority: TaskPriority;
  public forceAsync: boolean;
  public isTransition: boolean;
  public callback: (restore?: (options: RestoreOptions) => void) => void;
  public restore?: (options: RestoreOptions) => void;
  public sign?: () => string;
  public canceled?: boolean;

  constructor(options: TaskConstructorOptions) {
    const { priority, forceAsync, isTransition, sign, callback } = options;

    this.id = ++Task.nextTaskId;
    this.priority = priority;
    this.forceAsync = forceAsync;
    this.isTransition = isTransition;
    this.sign = sign;
    this.callback = callback;
  }
}

const shouldYield = () => getTime() >= deadline;

function scheduleCallback(callback: Callback, options?: ScheduleCallbackOptions) {
  const { priority = TaskPriority.NORMAL, forceAsync = false, isTransition = false, sign } = options || {};
  const task = new Task({ priority, forceAsync, isTransition, sign, callback });

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
    const sign = currentTask.sign();
    const hasSign = detectHasSameSign(sign, queue);

    if (hasSign) {
      currentTask = null;
      return pick(queue);
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
  return queue.some(x => x.isTransition && x.sign() === sign);
}

function hasPrimaryTask() {
  if (currentTask.isTransition) {
    const hasPrimary = queueMap.high.length > 0 || queueMap.normal.length > 0;
    if (hasPrimary) return true;
    const sign = currentTask.sign();
    const hasSign = detectHasSameSign(sign, queueMap.low);

    if (hasSign) {
      currentTask.canceled = true;
      return true;
    }
  }

  return false;
}

function cancelTask(restore: (options: RestoreOptions) => void) {
  if (currentTask.canceled) return;
  currentTask.restore = restore;
  queueMap.low.unshift(currentTask);
}

export { shouldYield, scheduleCallback, hasPrimaryTask, cancelTask, setupPorts, unrefPorts };
