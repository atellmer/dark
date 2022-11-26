import { type ScheduleCallbackOptions, getTime, workLoop, wipRootStore, TaskPriority } from '@dark-engine/core';

type Callback = () => boolean;

type QueueByPriority = {
  hight: Array<Task>;
  normal: Array<Task>;
  low1: Array<Task>;
  low2: Array<Task>;
};

const queueByPriority: QueueByPriority = {
  hight: [],
  normal: [],
  low1: [],
  low2: [],
};
const YEILD_INTERVAL = 4;
const MAX_LOW_PRIORITY_TASKS_LIMIT = 100000;
let scheduledCallback: Callback = null;
let deadline = 0;
let isMessageLoopRunning = false;
let currentTask: Task = null;

class Task {
  public static nextTaskId = 0;
  public id: number;
  public time: number;
  public timeoutMs: number;
  public priority: TaskPriority;
  public forceSync: boolean;
  public callback: () => void;

  constructor(options: Omit<Task, 'id'>) {
    this.id = ++Task.nextTaskId;
    this.time = options.time;
    this.timeoutMs = options.timeoutMs;
    this.priority = options.priority;
    this.forceSync = options.forceSync;
    this.callback = options.callback;
  }
}

const shouldYeildToHost = () => getTime() >= deadline;

function scheduleCallback(callback: () => void, options?: ScheduleCallbackOptions) {
  const { priority = TaskPriority.NORMAL, timeoutMs = 0, forceSync = false } = options || {};
  const task = new Task({ time: getTime(), timeoutMs, priority, forceSync, callback });
  const map: Record<TaskPriority, () => void> = {
    [TaskPriority.HIGH]: () => queueByPriority.hight.push(task),
    [TaskPriority.NORMAL]: () => queueByPriority.normal.push(task),
    [TaskPriority.LOW]: () => (task.timeoutMs > 0 ? queueByPriority.low2.push(task) : queueByPriority.low1.push(task)),
  };

  map[task.priority]();
  executeTasks();
}

function pick(queue: Array<Task>) {
  if (!queue.length) return false;
  currentTask = queue.shift();

  currentTask.callback();

  if (currentTask.forceSync) {
    requestCallbackSync(workLoop);
  } else {
    requestCallback(workLoop);
  }

  return true;
}

function executeTasks() {
  const isBusy = Boolean(wipRootStore.get());

  if (!isBusy) {
    checkOverdueTasks() ||
      gc() ||
      pick(queueByPriority.hight) ||
      pick(queueByPriority.normal) ||
      requestIdleCallback(() => pick(queueByPriority.low1) || pick(queueByPriority.low2));
  }
}

function gc() {
  if (queueByPriority.low1.length > MAX_LOW_PRIORITY_TASKS_LIMIT) {
    queueByPriority.low1 = [];
  }

  return false;
}

function checkOverdueTasks() {
  const [task] = queueByPriority.low2;

  if (task && getTime() - task.time > task.timeoutMs) {
    pick(queueByPriority.low2);
    return true;
  }

  return false;
}

function performWorkUntilDeadline() {
  if (scheduledCallback) {
    deadline = getTime() + YEILD_INTERVAL;

    try {
      const hasMoreWork = scheduledCallback();

      if (!hasMoreWork) {
        currentTask = null;
        isMessageLoopRunning = false;
        scheduledCallback = null;
        executeTasks();
      } else {
        port.postMessage(null);
      }
    } catch (error) {
      port.postMessage(null);
      throw error;
    }
  } else {
    isMessageLoopRunning = false;
  }
}

function requestCallback(callback: Callback) {
  if (process.env.NODE_ENV === 'test') {
    return requestCallbackSync(callback);
  }

  scheduledCallback = callback;

  if (!isMessageLoopRunning) {
    isMessageLoopRunning = true;
    port.postMessage(null);
  }
}

function requestCallbackSync(callback: Callback) {
  while (callback()) {
    //
  }
  executeTasks();
  currentTask = null;
}

let channel: MessageChannel = null;
let port: MessagePort = null;

function setup() {
  if (process.env.NODE_ENV === 'test') {
    return;
  }

  channel = new MessageChannel();
  port = channel.port2;

  channel.port1.onmessage = performWorkUntilDeadline;
}

setup();

export { shouldYeildToHost, scheduleCallback };
