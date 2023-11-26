import {
  type ScheduleCallbackOptions,
  type WorkLoop,
  getTime,
  workLoop,
  detectIsBusy,
  TaskPriority,
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
let deadline = 0;

class Task {
  public static nextTaskId = 0;
  public id: number;
  public time: number;
  public priority: TaskPriority;
  public forceAsync: boolean;
  public callback: () => void;

  constructor(options: Omit<Task, 'id'>) {
    this.id = ++Task.nextTaskId;
    this.time = options.time;
    this.priority = options.priority;
    this.forceAsync = options.forceAsync;
    this.callback = options.callback;
  }
}

const shouldYield = () => getTime() >= deadline;

function scheduleCallback(callback: () => void, options?: ScheduleCallbackOptions) {
  const { priority = TaskPriority.NORMAL, forceAsync = false } = options || {};
  const task = new Task({ time: getTime(), priority, forceAsync, callback });
  const map: Record<TaskPriority, () => void> = {
    [TaskPriority.HIGH]: () => queueMap.high.push(task),
    [TaskPriority.NORMAL]: () => queueMap.normal.push(task),
    [TaskPriority.LOW]: () => queueMap.low.push(task),
  };

  map[task.priority]();
  executeTasks();
}

function pick(queue: Array<Task>) {
  if (!queue.length) return false;
  const task = queue.shift();

  task.callback();
  task.forceAsync ? requestCallbackAsync(workLoop) : requestCallback(workLoop);

  return true;
}

function executeTasks() {
  const isBusy = detectIsBusy();

  if (!isBusy) {
    pick(queueMap.high) || pick(queueMap.normal) || pick(queueMap.low);
  }
}

function requestCallbackAsync(callback: WorkLoop) {
  if (process.env.NODE_ENV === 'test') {
    return requestCallback(callback);
  }

  const loop = () => {
    deadline = getTime() + YIELD_INTERVAL;

    while (callback(true)) {
      if (shouldYield() && detectIsBusy()) {
        setTimeout(() => loop());
        break;
      }
    }

    if (!detectIsBusy()) {
      executeTasks();
    }
  };

  loop();
}

function requestCallback(callback: WorkLoop) {
  callback(false);
  executeTasks();
}

export { shouldYield, scheduleCallback };
