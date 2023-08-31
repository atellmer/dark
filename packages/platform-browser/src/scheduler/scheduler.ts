import {
  type ScheduleCallbackOptions,
  type WorkLoop,
  getTime,
  workLoop,
  TaskPriority,
  detectIsBusy,
} from '@dark-engine/core';

type QueueByPriority = {
  animations: Array<Task>;
  hight: Array<Task>;
  normal: Array<Task>;
  low: Array<Task>;
};

const queueByPriority: QueueByPriority = {
  animations: [],
  hight: [],
  normal: [],
  low: [],
};
const YIELD_INTERVAL = 4;
let scheduledCallback: WorkLoop = null;
let deadline = 0;
let isMessageLoopRunning = false;

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
    [TaskPriority.ANIMATION]: () => queueByPriority.animations.push(task),
    [TaskPriority.HIGH]: () => queueByPriority.hight.push(task),
    [TaskPriority.NORMAL]: () => queueByPriority.normal.push(task),
    [TaskPriority.LOW]: () => queueByPriority.low.push(task),
  };

  map[task.priority]();
  executeTasks();
}

function pick(queue: Array<Task>) {
  if (!queue.length) return false;
  const task = queue.shift();
  const isAnimation = task.priority === TaskPriority.ANIMATION;

  task.callback();

  if (task.forceSync || isAnimation) {
    requestCallbackSync(workLoop);
  } else {
    requestCallback(workLoop);
  }

  return true;
}

function executeTasks() {
  const isBusy = detectIsBusy();

  if (!isBusy && !isMessageLoopRunning) {
    (queueByPriority.animations.length > 0 && pick(queueByPriority.animations)) ||
      (queueByPriority.hight.length > 0 && pick(queueByPriority.hight)) ||
      (queueByPriority.normal.length > 0 && pick(queueByPriority.normal)) ||
      (queueByPriority.low.length > 0 && pick(queueByPriority.low));
  }
}

function performWorkUntilDeadline() {
  if (scheduledCallback) {
    deadline = getTime() + YIELD_INTERVAL;

    try {
      const hasMoreWork = scheduledCallback(true);

      if (!hasMoreWork) {
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
  executeTasks();
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

export { shouldYield, scheduleCallback };
