import { workLoop, wipRootStore } from '@dark-engine/core';

type Callback = () => boolean;
type Queue = Array<Task>;

const queue: Queue = [];
let currentTask: Task = null;

class Task {
  public static nextTaskId = 0;
  public id: number;
  public callback: () => void;

  constructor(callback: () => void) {
    this.id = ++Task.nextTaskId;
    this.callback = callback;
  }
}

const shouldYeildToHost = () => false;

function scheduleCallback(callback: () => void) {
  queue.push(new Task(callback));
  executeTasks();
}

function pick(queue: Array<Task>) {
  if (!queue.length) return false;
  currentTask = queue.shift();
  currentTask.callback();

  requestCallbackSync(workLoop);

  return true;
}

function executeTasks() {
  const isBusy = Boolean(wipRootStore.get());

  if (!isBusy) {
    pick(queue);
  }
}

function requestCallbackSync(callback: Callback) {
  while (callback()) {
    //
  }
  executeTasks();
  currentTask = null;
}

export { shouldYeildToHost, scheduleCallback };
