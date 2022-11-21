import { type ScheduleCallbackOptions, getTime, workLoop, wipRootHelper, TaskPriority } from '@dark-engine/core';
import { type Callback } from './types';

type QueueByPriority = {
  hight: Array<Task>;
  normal: Array<Task>;
  low: Array<Task>;
};

const queueByPriority: QueueByPriority = {
  hight: [],
  normal: [],
  low: [],
};
const YEILD_INTERVAL = 10;
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
  public callback: () => void;

  constructor(options: Omit<Task, 'id'>) {
    this.id = ++Task.nextTaskId;
    this.time = options.time;
    this.timeoutMs = options.timeoutMs;
    this.priority = options.priority;
    this.callback = options.callback;
  }
}

const shouldYeildToHost = () => getTime() >= deadline;

function scheduleCallback(callback: () => void, options?: ScheduleCallbackOptions) {
  const { priority = TaskPriority.NORMAL, timeoutMs } = options || {};
  const task = new Task({ time: getTime(), timeoutMs, priority, callback });
  const map: Record<TaskPriority, () => void> = {
    [TaskPriority.HIGH]: () => queueByPriority.hight.push(task),
    [TaskPriority.NORMAL]: () => queueByPriority.normal.push(task),
    [TaskPriority.LOW]: () => queueByPriority.low.push(task),
  };

  map[task.priority]();
  executeTasks();
}

function pick(queue: Array<Task>) {
  if (!queue.length) return false;
  currentTask = queue.shift();

  currentTask.callback();
  requestCallback(workLoop);

  return true;
}

function executeTasks() {
  const isBusy = Boolean(wipRootHelper.get());

  if (!isBusy) {
    checkOverdueTasks() ||
      pick(queueByPriority.hight) ||
      pick(queueByPriority.normal) ||
      requestIdleCallback(() => pick(queueByPriority.low));
  }
}

function checkOverdueTasks() {
  const [task] = queueByPriority.low;

  if (task && task.timeoutMs > 0 && getTime() - task.time > task.timeoutMs) {
    pick(queueByPriority.low);
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
