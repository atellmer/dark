import {
  type ScheduleCallbackOptions,
  type WorkLoop,
  type Callback,
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
const YIELD_INTERVAL = 4;
let scheduledCallback: WorkLoop = null;
let deadline = 0;
let isMessageLoopRunning = false;
let currentTask: Task = null;

type TaskConstructorOptions = Omit<Task, 'id' | 'createdAt'>;

class Task {
  public static nextTaskId = 0;
  public id: number;
  public createdAt: number;
  public priority: TaskPriority;
  public forceSync: boolean;
  public callback: (restore?: Callback) => void;
  public restore?: Callback;

  constructor(options: TaskConstructorOptions) {
    const { priority, forceSync, callback } = options;
    const time = getTime();

    this.id = ++Task.nextTaskId;
    this.priority = priority;
    this.forceSync = forceSync;
    this.createdAt = time;
    this.callback = callback;
  }
}

const shouldYield = () => getTime() >= deadline;

function scheduleCallback(callback: Callback, options?: ScheduleCallbackOptions) {
  const { priority = TaskPriority.NORMAL, forceSync = false } = options || {};
  const task = new Task({ priority, forceSync, callback });

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
  currentTask.callback(currentTask.restore);
  currentTask.restore && (currentTask.restore = null);
  currentTask.forceSync ? requestCallbackSync(workLoop) : requestCallback(workLoop);

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

function requestCallback(callback: WorkLoop) {
  if (process.env.NODE_ENV === 'test') {
    return requestCallbackSync(callback);
  }

  scheduledCallback = callback;

  if (!isMessageLoopRunning) {
    isMessageLoopRunning = true;
    port.postMessage(null);
  }
}

function requestCallbackSync(callback: WorkLoop) {
  callback(false);
  currentTask = null;
  execute();
}

function hasPrimaryTask() {
  return currentTask.priority === TaskPriority.LOW && (queueMap.high.length > 0 || queueMap.normal.length > 0);
}

function cancelTask(restore: Callback) {
  currentTask.restore = restore;
  queueMap.low.unshift(currentTask);
}

let channel: MessageChannel = null;
let port: MessagePort = null;

function setup() {
  if (process.env.NODE_ENV === 'test') return;
  channel = new MessageChannel();
  port = channel.port2;
  channel.port1.onmessage = performWorkUntilDeadline;
}

setup();

export { shouldYield, scheduleCallback, hasPrimaryTask, cancelTask };
