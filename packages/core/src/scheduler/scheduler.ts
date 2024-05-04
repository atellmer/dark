import { HOOK_DELIMETER, YIELD_INTERVAL, TaskPriority } from '../constants';
import { getTime, detectIsPromise, detectIsFunction } from '../utils';
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
  }
}

class Scheduler {
  private queue: Record<TaskPriority, Array<Task>> = {
    [TaskPriority.HIGH]: [],
    [TaskPriority.NORMAL]: [],
    [TaskPriority.LOW]: [],
  };
  private deadline = 0;
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
    options.createLocation = options.createLocation || createRootLocation;
    this.put(createTask(callback, options));
    this.execute();
  }

  detectIsTransition() {
    return this.task.getIsTransition();
  }

  hasPrimaryTask() {
    const { high, normal, low } = this.getQueues();
    const hasPrimary = high.length > 0 || normal.length > 0;
    const hasAnotherTransition = low.length > 0;
    const hasSameTransition = hasAnotherTransition && detectHasSameTransition(this.task, low);

    if (hasPrimary) {
      const tasks = [...high, ...normal];
      const { hasHostUpdate, hasChildUpdate } = collectFlags(this.task, tasks);

      if (hasHostUpdate || hasChildUpdate) {
        const hasExact = detectHasExact(this.task, tasks);

        if (hasSameTransition || hasExact) {
          this.complete(this.task);
        } else {
          this.defer(this.task.clone());
        }

        this.task.markAsObsolete();
      }

      return true;
    }

    if (hasSameTransition) {
      this.complete(this.task);
      this.task.markAsObsolete();

      return true;
    }

    return false;
  }

  retain(fn: OnRestore) {
    if (!this.task.getIsObsolete()) {
      this.task.setOnRestore(fn);
      this.defer(this.task);
    }
  }

  private complete(task: Task) {
    task.complete();
  }

  private put(task: Task) {
    const queue = this.queue[task.getPriority()];

    if (task.getIsTransition()) {
      const loc = task.loc();
      const tasks = queue.filter(x => x.loc() !== loc);

      queue.splice(0, queue.length, ...tasks);
    }

    queue.push(task);
  }

  private pick(queue: Array<Task>) {
    if (queue.length === 0) return false;
    this.task = queue.shift();

    if (this.task.getIsTransition() && this.task.getOnTransitionStart()) {
      const task = this.task;
      const start = task.getOnTransitionStart();

      this.defer(task);
      task.setOnTransitionStart(null);
      start();
      this.execute();

      return false;
    }

    this.task.run();
    this.task.getForceAsync() ? this.requestCallbackAsync(workLoop) : this.requestCallback(workLoop);

    return true;
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
    const result = callback(false);

    if (detectIsPromise(result)) {
      result.finally(() => {
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
      const result = this.scheduledCallback(true);

      if (detectIsPromise(result)) {
        result.finally(() => {
          this.port.postMessage(null);
        });
      } else if (result) {
        this.port.postMessage(null);
      } else {
        this.complete(this.task);
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
  private createLocation?: CreateLocation = null;
  private onRestore?: OnRestore = null;
  private onTransitionStart?: Callback = null;
  private onTransitionEnd?: Callback = null;
  private static nextTaskId = 0;

  constructor(callback: TaskCallback, priority: TaskPriority, forceAsync: boolean) {
    this.__id = ++Task.nextTaskId;
    this.callback = callback;
    this.priority = priority;
    this.forceAsync = forceAsync;
  }

  clone() {
    const task = createTask(this.callback, {
      priority: this.priority,
      forceAsync: this.forceAsync,
      isTransition: this.isTransition,
      createLocation: this.createLocation,
      onTransitionStart: this.onTransitionStart,
      onTransitionEnd: this.onTransitionEnd,
    });

    return task;
  }

  getPriority() {
    return this.priority;
  }

  getForceAsync() {
    return this.forceAsync;
  }

  setIsTransition(value: boolean) {
    this.isTransition = value;
  }

  getIsTransition() {
    return this.isTransition;
  }

  run() {
    this.callback(this.onRestore);
    this.onRestore = null;
  }

  complete() {
    this.isTransition && !this.isObsolete && detectIsFunction(this.onTransitionEnd) && this.onTransitionEnd();
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

  setCreateLocation(fn: CreateLocation) {
    this.createLocation = fn;
  }

  loc() {
    const [loc] = this.createLocation().split(HOOK_DELIMETER);

    return loc;
  }

  $loc() {
    return this.createLocation();
  }

  getOnTransitionStart() {
    return this.onTransitionStart;
  }

  setOnTransitionStart(fn: Callback) {
    this.onTransitionStart = fn;
  }

  setOnTransitionEnd(fn: Callback) {
    this.onTransitionEnd = fn;
  }
}

function collectFlags(task: Task, tasks: Array<Task>) {
  const loc = task.loc();
  let hasTopUpdate = false;
  let hasHostUpdate = false;
  let hasChildUpdate = false;

  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    const $loc = task.loc();

    if ($loc.length < loc.length && loc.indexOf($loc) === 0) {
      hasTopUpdate = true;
    } else if ($loc === loc) {
      hasHostUpdate = true;
    } else if ($loc.length > loc.length && $loc.indexOf(loc) === 0) {
      hasChildUpdate = true;
    }
  }

  return {
    hasTopUpdate,
    hasHostUpdate,
    hasChildUpdate,
  };
}

function detectHasSameTransition(task: Task, tasks: Array<Task>) {
  if (tasks.length === 0) return false;
  const loc = task.loc();
  const $loc = tasks[0].loc();

  return loc === $loc;
}

function detectHasExact(task: Task, tasks: Array<Task>) {
  const $loc = task.$loc();
  const hasExact = tasks.some(x => x.$loc() === $loc);

  return hasExact;
}

function createTask(callback: TaskCallback, options: Omit<ScheduleCallbackOptions, 'onCompleted'>) {
  const {
    priority = TaskPriority.NORMAL,
    forceAsync = false,
    isTransition = false,
    createLocation,
    onTransitionStart,
    onTransitionEnd,
  } = options;
  const task = new Task(callback, priority, forceAsync);

  task.setIsTransition(isTransition);
  task.setOnTransitionStart(onTransitionStart);
  task.setOnTransitionEnd(onTransitionEnd);
  task.setCreateLocation(createLocation || createRootLocation);

  return task;
}

const createRootLocation: CreateLocation = () => '>';

type PortEvent = 'message';
type PortListener = (value: unknown) => void;

type TaskCallback = (fn: OnRestore) => void;
type CreateLocation = () => string;

export type OnRestoreOptions = {
  fiber: Fiber;
  setValue?: Callback;
  resetValue?: Callback;
};

export type OnRestore = (options: OnRestoreOptions) => void;

export type ScheduleCallbackOptions = {
  priority: TaskPriority;
  forceAsync?: boolean;
  isTransition?: boolean;
  createLocation?: () => string;
  onTransitionStart?: Callback;
  onTransitionEnd?: Callback;
};

const scheduler = new Scheduler();

export { scheduler };
