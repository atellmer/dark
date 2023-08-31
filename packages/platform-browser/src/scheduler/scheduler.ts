import {
  type ScheduleCallbackOptions,
  type WorkLoop,
  getTime,
  workLoop,
  TaskPriority,
  detectIsBusy,
} from '@dark-engine/core';

type QueueMap = {
  animations: Array<Task>;
  hight: Array<Task>;
  normal: Array<Task>;
  low: Array<Task>;
};

const queueMap: QueueMap = {
  animations: [],
  hight: [],
  normal: [],
  low: [],
};
const YIELD_INTERVAL = 4;
let scheduledCallback: WorkLoop = null;
let deadline = 0;
let isMessageLoopRunning = false;
let currentTask: Task = null;

class Task {
  public static nextTaskId = 0;
  public id: number;
  public time: number;
  public priority: TaskPriority;
  public forceSync: boolean;
  public callback: () => void;

  constructor(options: Omit<Task, 'id'>) {
    this.id = ++Task.nextTaskId;
    this.time = options.time;
    this.priority = options.priority;
    this.forceSync = options.forceSync;
    this.callback = options.callback;
  }
}

const shouldYield = () => getTime() >= deadline;

function scheduleCallback(callback: () => void, options?: ScheduleCallbackOptions) {
  const { priority = TaskPriority.NORMAL, forceSync = false } = options || {};
  const task = new Task({ time: getTime(), priority, forceSync, callback });
  const map: Record<TaskPriority, () => void> = {
    [TaskPriority.ANIMATION]: () => queueMap.animations.push(task),
    [TaskPriority.HIGH]: () => queueMap.hight.push(task),
    [TaskPriority.NORMAL]: () => queueMap.normal.push(task),
    [TaskPriority.LOW]: () => queueMap.low.push(task),
  };

  map[task.priority]();
  executeTasks();
}

function pick(queue: Array<Task>) {
  if (!queue.length) return false;
  currentTask = queue.shift();
  currentTask.callback();
  currentTask.forceSync ? requestCallbackSync(workLoop) : requestCallback(workLoop);

  return true;
}

function executeTasks() {
  const isBusy = detectIsBusy();

  if (!isBusy && !isMessageLoopRunning) {
    pick(queueMap.animations) || pick(queueMap.hight) || pick(queueMap.normal) || pick(queueMap.low);
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
      executeTasks();
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
  executeTasks();
}

function hasPrimaryTask() {
  return (
    currentTask.priority === TaskPriority.LOW &&
    (queueMap.animations.length > 0 || queueMap.hight.length > 0 || queueMap.normal.length > 0)
  );
}

function cancelTask() {
  queueMap.low.unshift(currentTask);
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

export { shouldYield, scheduleCallback, hasPrimaryTask, cancelTask };
