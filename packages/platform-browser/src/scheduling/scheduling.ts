import { getTime, workLoop, nextUnitOfWorkHelper, TaskPriority } from '@dark-engine/core';
import { type Callback } from './model';

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
  public priority: TaskPriority;
  public callback: () => void;

  constructor(options: Pick<Task, 'priority' | 'callback'>) {
    this.id = ++Task.nextTaskId;
    this.priority = options.priority;
    this.callback = options.callback;
  }
}

const shouldYeildToHost = () => getTime() >= deadline;

function scheduleCallback(callback: () => void, priority: TaskPriority = TaskPriority.NORMAL) {
  const task = new Task({ priority, callback });
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
  const hasMoreWork = Boolean(nextUnitOfWorkHelper.get());

  if (!hasMoreWork) {
    pick(queueByPriority.hight) || pick(queueByPriority.normal) || pick(queueByPriority.low);
  }
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
