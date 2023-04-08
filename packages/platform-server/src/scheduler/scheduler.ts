import { MessageChannel, type MessagePort } from 'node:worker_threads';
import { type ScheduleCallbackOptions, type WorkLoop, getTime, workLoop, detectIsBusy } from '@dark-engine/core';

type Queue = Array<Task>;

const queue: Queue = [];
const YIELD_INTERVAL = 4;
let scheduledCallback: WorkLoop = null;
let deadline = 0;
let isMessageLoopRunning = false;
let currentTask: Task = null;

class Task {
  public static nextTaskId = 0;
  public id: number;
  public time: number;
  public forceSync: boolean;
  public callback: () => void;
  public onCompleted: () => void;

  constructor(options: Omit<Task, 'id'>) {
    this.id = ++Task.nextTaskId;
    this.time = options.time;
    this.forceSync = options.forceSync;
    this.callback = options.callback;
    this.onCompleted = options.onCompleted;
  }
}

const shouldYeildToHost = () => getTime() >= deadline;

function scheduleCallback(callback: () => void, options?: ScheduleCallbackOptions) {
  const { forceSync = false, onCompleted = () => {} } = options || {};
  const task = new Task({ time: getTime(), forceSync, callback, onCompleted });

  queue.push(task);
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
}

function executeTasks() {
  const isBusy = detectIsBusy();

  if (!isBusy) {
    pick(queue);
  }
}

function performWorkUntilDeadline() {
  if (scheduledCallback) {
    deadline = getTime() + YIELD_INTERVAL;

    try {
      const hasMoreWork = scheduledCallback(true);

      if (!hasMoreWork) {
        currentTask.onCompleted();
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
  currentTask.onCompleted();
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

  channel.port1.on('message', performWorkUntilDeadline);
}

setup();

export { shouldYeildToHost, scheduleCallback };