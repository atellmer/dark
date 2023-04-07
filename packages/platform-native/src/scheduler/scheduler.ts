import {
  type ScheduleCallbackOptions,
  type WorkLoop,
  getTime,
  workLoop,
  detectIsBusy,
  TaskPriority,
  dummyFn,
} from '@dark-engine/core';

type QueueByPriority = {
  animations: Array<Task>;
  hight: Array<Task>;
  normal: Array<Task>;
  low1: Array<Task>;
  low2: Array<Task>;
};

const queueByPriority: QueueByPriority = {
  animations: [],
  hight: [],
  normal: [],
  low1: [],
  low2: [],
};
const YIELD_INTERVAL = 4;
const MAX_LOW_PRIORITY_TASKS_LIMIT = 100000;
let deadline = 0;
let currentTask: Task = null;

class Task {
  public static nextTaskId = 0;
  public id: number;
  public time: number;
  public timeoutMs: number;
  public priority: TaskPriority;
  public forceSync: boolean;
  public callback: () => void;
  public onCompleted: () => void;

  constructor(options: Omit<Task, 'id'>) {
    this.id = ++Task.nextTaskId;
    this.time = options.time;
    this.timeoutMs = options.timeoutMs;
    this.priority = options.priority;
    this.forceSync = options.forceSync;
    this.callback = options.callback;
    this.onCompleted = options.onCompleted;
  }
}

const shouldYeildToHost = () => getTime() >= deadline;

function scheduleCallback(callback: () => void, options?: ScheduleCallbackOptions) {
  const { priority = TaskPriority.NORMAL, timeoutMs = 0, forceSync = false, onCompleted = dummyFn } = options || {};
  const task = new Task({ time: getTime(), timeoutMs, priority, forceSync, callback, onCompleted });
  const map: Record<TaskPriority, () => void> = {
    [TaskPriority.ANIMATION]: () => queueByPriority.animations.push(task),
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
  const isAnimation = currentTask.priority === TaskPriority.ANIMATION;

  currentTask.callback();

  if (currentTask.forceSync || isAnimation) {
    requestCallbackSync(workLoop);
  } else {
    requestCallback(workLoop);
  }

  return true;
}

function executeTasks() {
  const isBusy = detectIsBusy();

  if (!isBusy) {
    checkOverdueTasks() ||
      gc() ||
      pick(queueByPriority.animations) ||
      pick(queueByPriority.hight) ||
      pick(queueByPriority.normal) ||
      setTimeout(() => pick(queueByPriority.low1) || pick(queueByPriority.low2));
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

function requestCallback(callback: WorkLoop) {
  if (process.env.NODE_ENV === 'test') {
    return requestCallbackSync(callback);
  }

  const loop = () => {
    deadline = getTime() + YIELD_INTERVAL;

    while (callback(true)) {
      if (shouldYeildToHost() && detectIsBusy()) {
        setTimeout(() => loop());
        break;
      }
    }

    if (!detectIsBusy()) {
      currentTask.onCompleted();
      currentTask = null;
      executeTasks();
    }
  };

  loop();
}

function requestCallbackSync(callback: WorkLoop) {
  callback(false);
  currentTask.onCompleted();
  currentTask = null;
  executeTasks();
}

export { shouldYeildToHost, scheduleCallback };
