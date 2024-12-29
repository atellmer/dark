import { getTime, detectIsPromise, detectIsFunction, dummyFn } from '../utils';
import { HOOK_DELIMETER, YIELD_INTERVAL, TaskPriority } from '../constants';
import { type WorkLoop, workLoop, detectIsBusy } from '../workloop';
import { type Callback } from '../shared';
import { EventEmitter } from '../emitter';
import { platform } from '../platform';
import { type Fiber } from '../fiber';

class MessageChannel extends EventEmitter<PortEvent> {
  port1: MessagePort = null;
  port2: MessagePort = null;

  constructor() {
    super();
    this.port1 = new MessagePort(this);
    this.port2 = new MessagePort(this);
  }
}

class MessagePort {
  channel: MessageChannel;
  offs: Array<Callback> = [];

  constructor(channel: MessageChannel) {
    this.channel = channel;
  }

  on(event: PortEvent, callback: PortListener) {
    const off = this.channel.on(event, callback);

    this.offs.push(off);
  }

  postMessage(value: unknown) {
    platform.spawn(() => {
      this.channel.emit('message', value);
    });
  }

  unref() {
    this.offs.forEach(x => x());
    this.offs = [];
  }
}

class Scheduler {
  private queue: Record<TaskPriority, Array<Task>> = {
    [TaskPriority.HIGH]: [],
    [TaskPriority.NORMAL]: [],
    [TaskPriority.LOW]: [],
  };
  private deadline = 0;
  private lastId = 0;
  private task: Task = null;
  private scheduledCallback: WorkLoop = null;
  private isMessageLoopRunning = false;
  private channel: MessageChannel = null;
  private port: MessagePort = null;

  constructor() {
    this.channel = new MessageChannel();
    this.port = this.channel.port2;
    this.channel.port1.on('message', this.performWorkUntilDeadline.bind(this));
  }

  reset() {
    this.deadline = 0;
    this.task = null;
    this.scheduledCallback = null;
    this.isMessageLoopRunning = false;
  }

  shouldYield() {
    return getTime() >= this.deadline;
  }

  schedule(callback: TaskCallback, options: ScheduleCallbackOptions) {
    const task = createTask(callback, options);

    this.lastId = task.getId();
    this.put(task);
    this.execute();
  }

  getLastId() {
    return this.lastId;
  }

  detectIsTransition() {
    return this.task.getIsTransition();
  }

  hasNewTask() {
    const { high, normal, low } = this.getQueues();

    return high.length + normal.length + low.length > 0;
  }

  retain(fn: OnRestore) {
    const { high, normal, low } = this.getQueues();
    const tasks = [...high, ...normal, ...low];
    const { hasHostUpdate, hasChildUpdate } = collectFlags(this.task, tasks);

    if (hasHostUpdate || hasChildUpdate) {
      const hasExact = detectHasExact(this.task, tasks);

      if (hasExact) {
        this.complete(this.task, true); // cancels the task
      } else {
        this.defer(this.task); // cancels and restarts the task from the beginning
      }

      this.task.markAsObsolete();
    } else {
      this.task.setOnRestore(fn);
      this.defer(this.task); // runs the task from the same place
    }
  }

  private complete(task: Task, isCanceled: boolean) {
    task.complete(isCanceled);
  }

  private put(task: Task) {
    const queue = this.queue[task.getPriority()];

    if (task.getIsTransition()) {
      const base = task.base();
      const tasks = queue.filter(x => x.base() !== base);

      queue.splice(0, queue.length, ...tasks);
    }

    queue.push(task);
  }

  private pick(queue: Array<Task>) {
    if (queue.length === 0) return false;
    this.task = queue.shift();
    this.run(this.task);

    return true;
  }

  private run(task: Task) {
    try {
      task.run();
      task.getForceAsync() ? this.requestCallbackAsync(workLoop) : this.requestCallback(workLoop);
    } catch (something) {
      if (detectIsPromise(something)) {
        something.catch(dummyFn).finally(() => {
          this.run(task);
        });
      } else {
        throw something;
      }
    }
  }

  private execute() {
    const isBusy = detectIsBusy();

    if (!isBusy && !this.isMessageLoopRunning) {
      const { high, normal, low } = this.getQueues();

      this.pick(high) || this.pick(normal) || this.pick(low);
    }
  }

  private requestCallbackAsync(callback: WorkLoop) {
    this.scheduledCallback = callback;

    if (!this.isMessageLoopRunning) {
      this.isMessageLoopRunning = true;
      this.port.postMessage(null);
    }
  }

  private requestCallback(callback: WorkLoop) {
    const something = callback(false);

    if (detectIsPromise(something)) {
      something.catch(dummyFn).finally(() => {
        this.requestCallback(callback);
      });
    } else {
      this.task = null;
      this.execute();
    }
  }

  private performWorkUntilDeadline() {
    if (this.scheduledCallback) {
      this.deadline = getTime() + YIELD_INTERVAL;
      const something = this.scheduledCallback(true);

      if (detectIsPromise(something)) {
        something.catch(dummyFn).finally(() => {
          this.port.postMessage(null);
        });
      } else if (something) {
        this.port.postMessage(null);
      } else {
        this.complete(this.task, false);
        this.reset();
        this.execute();
      }
    } else {
      this.isMessageLoopRunning = false;
    }
  }

  private defer(task: Task) {
    const { low } = this.getQueues();

    low.unshift(task);
  }

  private getQueues() {
    const high = this.queue[TaskPriority.HIGH];
    const normal = this.queue[TaskPriority.NORMAL];
    const low = this.queue[TaskPriority.LOW];

    return {
      high,
      normal,
      low,
    };
  }
}

class Task {
  private __id: number;
  private priority: TaskPriority;
  private forceAsync = false;
  private isTransition = false;
  private isObsolete = false;
  private callback: TaskCallback = null;
  private createLoc?: CreateLoc = null;
  private onRestore?: OnRestore = null;
  private onTransitionEnd?: OnTransitionEnd = null;
  private static nextTaskId = 0;

  constructor(callback: TaskCallback, priority: TaskPriority, forceAsync: boolean) {
    this.__id = ++Task.nextTaskId;
    this.callback = callback;
    this.priority = priority;
    this.forceAsync = forceAsync;
  }

  getId() {
    return this.__id;
  }

  getPriority() {
    return this.priority;
  }

  getForceAsync() {
    return this.forceAsync;
  }

  setIsTransition(x: boolean) {
    this.isTransition = x;
  }

  getIsTransition() {
    return this.isTransition;
  }

  run() {
    this.isObsolete = false; // !
    this.callback(this.onRestore);
    this.onRestore = null;
  }

  complete(isCanceled: boolean) {
    this.isTransition &&
      !this.isObsolete &&
      detectIsFunction(this.onTransitionEnd) &&
      this.onTransitionEnd(loc => (isCanceled ? this.createBase(loc) === this.base() : false));
  }

  markAsObsolete() {
    this.isObsolete = true;
  }

  getIsObsolete() {
    return this.isObsolete;
  }

  setOnRestore(fn: OnRestore) {
    this.onRestore = fn;
  }

  setCreateLoc(fn: CreateLoc) {
    this.createLoc = fn;
  }

  createBase(loc: string) {
    const [base] = loc.split(HOOK_DELIMETER);

    return base;
  }

  base() {
    return this.createBase(this.loc());
  }

  loc() {
    return this.createLoc();
  }

  setOnTransitionEnd(fn: OnTransitionEnd) {
    this.onTransitionEnd = fn;
  }
}

function collectFlags(task: Task, tasks: Array<Task>) {
  const base = task.base();
  let hasTopUpdate = false;
  let hasHostUpdate = false;
  let hasChildUpdate = false;

  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    const $base = task.base();

    if ($base.length < base.length && base.indexOf($base) === 0) {
      hasTopUpdate = true;
    } else if ($base === base) {
      hasHostUpdate = true;
    } else if ($base.length > base.length && $base.indexOf(base) === 0) {
      hasChildUpdate = true;
    }
  }

  return {
    hasTopUpdate,
    hasHostUpdate,
    hasChildUpdate,
  };
}

function detectHasExact(task: Task, tasks: Array<Task>) {
  const $loc = task.loc();
  const hasExact = tasks.some(x => x.loc() === $loc);

  return hasExact;
}

function createTask(callback: TaskCallback, options: Omit<ScheduleCallbackOptions, 'onCompleted'>) {
  const { priority = TaskPriority.NORMAL, forceAsync = false, isTransition = false, loc, onTransitionEnd } = options;
  const task = new Task(callback, priority, forceAsync);

  task.setIsTransition(isTransition);
  task.setOnTransitionEnd(onTransitionEnd);
  task.setCreateLoc(loc || rootLoc);

  return task;
}

const rootLoc: CreateLoc = () => '>';

type PortEvent = 'message';
type PortListener = (value: unknown) => void;

type TaskCallback = (fn: OnRestore) => void;
type CreateLoc = () => string;

export type OnRestoreOptions = {
  fiber: Fiber;
  setValue?: Callback;
  resetValue?: Callback;
};

export type OnRestore = (options: OnRestoreOptions) => void;

export type OnTransitionEnd = (fn: (loc: string) => boolean) => void;

export type ScheduleCallbackOptions = {
  priority: TaskPriority;
  forceAsync?: boolean;
  isTransition?: boolean;
  loc?: () => string;
  onTransitionEnd?: OnTransitionEnd;
};

const scheduler = new Scheduler();

export { scheduler };
