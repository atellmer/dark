import { MessageChannel, type MessagePort } from 'node:worker_threads';
import { type ScheduleCallbackOptions, type WorkLoop, getTime, workLoop, detectIsBusy } from '@dark-engine/core';

type Queue = Array<Task>;

const queue: Queue = [];
const YIELD_INTERVAL = 4;
let scheduledCallback: WorkLoop = null;
let deadline = 0;
let isMessageLoopRunning = false;

class Task {
  public static nextTaskId = 0;
  public id: number;
  public time: number;
  public forceAsync: boolean;
  public callback: () => void;

  constructor(options: Omit<Task, 'id'>) {
    this.id = ++Task.nextTaskId;
    this.time = options.time;
    this.forceAsync = options.forceAsync;
    this.callback = options.callback;
  }
}

const shouldYield = () => getTime() >= deadline;

function scheduleCallback(callback: () => void, options?: ScheduleCallbackOptions) {
  const { forceAsync = false } = options || {};
  const task = new Task({ time: getTime(), forceAsync, callback });

  queue.push(task);
  executeTasks();
}

function pick(queue: Array<Task>) {
  if (!queue.length) return false;
  const task = queue.shift();

  task.callback();
  task.forceAsync ? requestCallbackAsync(workLoop) : requestCallback(workLoop);
}

function executeTasks() {
  const isBusy = detectIsBusy();

  if (!isBusy && !isMessageLoopRunning) {
    pick(queue);
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

function requestCallbackAsync(callback: WorkLoop) {
  if (process.env.NODE_ENV === 'test') {
    return requestCallback(callback);
  }

  scheduledCallback = callback;

  if (!isMessageLoopRunning) {
    isMessageLoopRunning = true;
    port.postMessage(null);
  }
}

function requestCallback(callback: WorkLoop) {
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

  channel.port1.on('message', performWorkUntilDeadline);
}

setup();

export { shouldYield, scheduleCallback };
