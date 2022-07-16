import { getTime, workLoop, nextUnitOfWorkHelper } from '@dark-engine/core';
import { type Callback } from './model';

const queue: Array<Task> = [];
const YEILD_INTERVAL = 5;
let scheduledCallback: Callback = null;
let deadline = 0;
let isMessageLoopRunning = false;
let currentTask: Task = null;

class Task {
  public static nextTaskId = 0;
  public id: number;
  public callback: () => void;

  constructor(options: Pick<Task, 'callback'>) {
    this.id = ++Task.nextTaskId;
    this.callback = options.callback;
  }
}

const shouldYeildToHost = () => getTime() >= deadline;

function scheduleCallback(callback: () => void) {
  const task = new Task({ callback });

  queue.push(task);
  executeTasks();
}

function executeTasks() {
  const hasMoreWork = Boolean(nextUnitOfWorkHelper.get());

  if (!hasMoreWork) {
    if (queue.length > 0) {
      currentTask = queue.shift();
      currentTask.callback();
      requestCallback(workLoop);
    }
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
