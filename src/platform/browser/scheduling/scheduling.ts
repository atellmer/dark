import { workLoop } from '@core/fiber';
import { nextUnitOfWorkHelper } from '@core/scope';
import { Callback, TaskPriority } from './model';
import { getTime } from '@helpers';


const queue: Array<Task> = [];
const yeildInterval = 5;
let scheduledCallback: Callback = null;
let deadline = 0;
let isMessageLoopRunning = false;
class Task {
  public static nextTaskId: number = 0;
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

  if (priority === TaskPriority.HIGHT) {
    queue.unshift(task);
  } else {
    queue.push(task);
  }
  executeTasks();
}

function executeTasks() {
  const hasMoreWork = Boolean(nextUnitOfWorkHelper.get());

  if (!hasMoreWork && queue.length > 0) {
    const task = queue.shift();

    task.callback();
    requestCallback(workLoop);
  }
};

function performWorkUntilDeadline() {
  if (scheduledCallback) {
    deadline = getTime() + yeildInterval;

    try {
      const hasMoreWork = scheduledCallback();

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
  while (callback()) {}
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

export {
  shouldYeildToHost,
  scheduleCallback,
};
