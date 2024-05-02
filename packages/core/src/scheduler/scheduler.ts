import { ROOT, HOOK_DELIMETER, YIELD_INTERVAL, TaskPriority } from '../constants';
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

  schedule(callback: TaskCallback, options: ScheduleCallbackOptions = {}) {
    options.createLocation = options.createLocation || createRootLocation;
    this.put(createTask(callback, options));
    this.execute();
  }

  hasPrimaryTask() {
    if (!this.task.getIsTransition()) return false;
    const { high, normal, low } = this.getQueues();
    const hasPrimary = high.length > 0 || normal.length > 0;
    const hasLow = low.length > 0;
    const [lowTask] = low;

    if (hasPrimary || hasLow) {
      const loc = this.task.loc();

      if (hasPrimary) {
        const { hasSameOrNested, hasSame } = Task.detectHasRelatedUpdate(loc, [...high, ...normal], true);

        if (hasSameOrNested) {
          if (hasLow && lowTask.loc() === loc) {
            this.complete(this.task);
          } else {
            if (hasSame) {
              this.complete(this.task);
            } else {
              this.defer(this.task.clone());
            }
          }

          this.task.markAsObsolete();
        }

        return true;
      }

      if (hasLow) {
        const { hasSame } = Task.detectHasRelatedUpdate(loc, low);

        if (hasSame) {
          this.task.markAsObsolete();

          return true;
        }
      }
    }

    return false;
  }

  cancelTask(fn: OnRestoreTask) {
    if (this.task.getIsObsolete()) return;
    this.task.setOnRestoreTask(fn);
    this.defer(this.task);
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

type TaskCallback = (fn: OnRestoreTask) => void;
type OnRestoreTask = (options: RestoreOptions) => void;
type CreateLocation = () => string;

class Task {
  private __id: number;
  private priority: TaskPriority;
  private forceAsync: boolean;
  private isTransition: boolean;
  private isObsolete: boolean;
  private callback: TaskCallback;
  private createLocation?: CreateLocation = null;
  private onRestoreTask?: OnRestoreTask = null;
  private onTransitionCompleted?: Callback = null;
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
      onTransitionCompleted: this.onTransitionCompleted,
      createLocation: this.createLocation,
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
    this.callback(this.onRestoreTask);
    this.onRestoreTask = null;
  }

  complete() {
    this.isTransition &&
      !this.isObsolete &&
      detectIsFunction(this.onTransitionCompleted) &&
      this.onTransitionCompleted();
  }

  markAsObsolete() {
    this.isObsolete = true;
  }

  getIsObsolete() {
    return this.isObsolete;
  }

  setOnRestoreTask(fn: OnRestoreTask) {
    this.onRestoreTask = fn;
  }

  setLocationCreator(fn: CreateLocation) {
    this.createLocation = fn;
  }

  loc() {
    return this.createLocation();
  }

  setOnTransitionCompleted(fn: Callback) {
    this.onTransitionCompleted = fn;
  }

  static detectHasRelatedUpdate(loc: string, tasks: Array<Task>, deep = false) {
    const [$loc] = loc.split(HOOK_DELIMETER);
    let hasSameOrNested = false;
    let hasSame = false;

    tasks.some(x => {
      const $$loc = x.createLocation();

      hasSame = $$loc === loc;
      hasSameOrNested = hasSame || (deep && $$loc.length > loc.length && $$loc.indexOf($loc) !== -1);

      return hasSameOrNested;
    });

    return { hasSameOrNested, hasSame };
  }
}

function createTask(callback: TaskCallback, options: Omit<ScheduleCallbackOptions, 'onCompleted'>) {
  const {
    priority = TaskPriority.NORMAL,
    forceAsync = false,
    isTransition = false,
    createLocation,
    onTransitionCompleted,
  } = options;
  const task = new Task(callback, priority, forceAsync);

  task.setIsTransition(isTransition);
  task.setOnTransitionCompleted(onTransitionCompleted);
  task.setLocationCreator(createLocation || createRootLocation);

  return task;
}

const createRootLocation: CreateLocation = () => ROOT;

type PortEvent = 'message';
type PortListener = (value: unknown) => void;

export type RestoreOptions = {
  fiber: Fiber;
  setValue?: Callback;
  resetValue?: Callback;
};

export type ScheduleCallbackOptions = {
  priority?: TaskPriority;
  forceAsync?: boolean;
  isTransition?: boolean;
  createLocation?: () => string;
  onTransitionCompleted?: Callback;
};

const scheduler = new Scheduler();

export { scheduler };
