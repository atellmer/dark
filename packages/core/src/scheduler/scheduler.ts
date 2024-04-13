import { ROOT, HOOK_DELIMETER, YIELD_INTERVAL, TaskPriority } from '../constants';
import { getTime, detectIsFunction, detectIsPromise, nextTick } from '../utils';
import { type WorkLoop, workLoop, detectIsBusy } from '../workloop';
import { type SetPendingStatus } from '../start-transition';
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

  schedule(callback: Callback, options?: ScheduleCallbackOptions) {
    const {
      priority = TaskPriority.NORMAL,
      forceAsync = false,
      isTransition = false,
      createLocation,
      setPendingStatus,
    } = options || {};
    const task = new Task(callback, priority, forceAsync);

    task.setIsTransition(isTransition);
    task.setPendingSetter(setPendingStatus);
    task.setLocationCreator(createLocation || createRootLocation);
    this.put(task);
    this.execute();
  }

  hasPrimaryTask() {
    if (!this.task.getIsTransition()) return false;
    const { high, normal, low } = this.getQueues();
    const hasPrimary = high.length > 0 || normal.length > 0;
    const hasLow = low.length > 0;

    if (hasPrimary || hasLow) {
      const loc = this.task.createLocation();

      if (hasPrimary) {
        const has = Task.detectHasRelatedUpdate(loc, high, true) || Task.detectHasRelatedUpdate(loc, normal, true);

        if (has) {
          this.task.markAsUnnecessary();
        }

        return true;
      }

      if (hasLow) {
        const has = Task.detectHasRelatedUpdate(loc, low);

        if (has) {
          this.task.markAsUnnecessary();

          return true;
        }
      }
    }

    return false;
  }

  cancelTask(fn: TaskRestorer) {
    if (this.task.getIsUnnecessary()) return this.complete(this.task);
    this.task.setTaskRestorer(fn);
    this.defer(this.task);
  }

  private complete(task: Task) {
    task.pending(false);
  }

  private put(task: Task) {
    const queue = this.queue[task.getPriority()];

    if (task.getIsTransition()) {
      const loc = task.createLocation();
      const tasks = queue.filter(x => x.createLocation() !== loc);

      queue.splice(0, queue.length, ...tasks);
    }

    queue.push(task);
  }

  private pick(queue: Array<Task>) {
    if (queue.length === 0) return false;
    this.task = queue.shift();

    if (this.task.getIsTransition() && this.task.canPending()) {
      const task = this.task;

      task.markAsPending();
      this.defer(this.task);
      this.task = null;

      nextTick(() => task.pending(true));

      return true;
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

type TaskCallback = (fn: TaskRestorer) => void;
type TaskRestorer = (options: RestoreOptions) => void;
type LocationCreator = () => string;

class Task {
  private id: number;
  private priority: TaskPriority;
  private forceAsync: boolean;
  private isTransition: boolean;
  private isPending: boolean;
  private isUnnecessary: boolean;
  private callback: TaskCallback;
  private taskRestorer?: TaskRestorer = null;
  private locationCreator?: LocationCreator;
  private pendingSetter?: SetPendingStatus = null;
  private static nextTaskId = 0;

  constructor(callback: TaskCallback, priority: TaskPriority, forceAsync: boolean) {
    this.id = ++Task.nextTaskId;
    this.callback = callback;
    this.priority = priority;
    this.forceAsync = forceAsync;
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
    this.callback(this.taskRestorer);
    this.taskRestorer = null;
  }

  pending(value: boolean) {
    this.isTransition && this.pendingSetter && this.pendingSetter(value);
  }

  markAsPending() {
    this.isPending = true;
  }

  canPending() {
    return !this.isPending && detectIsFunction(this.pendingSetter);
  }

  markAsUnnecessary() {
    this.isUnnecessary = true;
  }

  getIsUnnecessary() {
    return this.isUnnecessary;
  }

  setTaskRestorer(fn: TaskRestorer) {
    this.taskRestorer = fn;
  }

  setLocationCreator(fn: LocationCreator) {
    this.locationCreator = fn;
  }

  createLocation() {
    return this.locationCreator();
  }

  setPendingSetter(fn: SetPendingStatus) {
    this.pendingSetter = fn;
  }

  static detectHasRelatedUpdate(loc: string, tasks: Array<Task>, deep = false) {
    const [$loc] = loc.split(HOOK_DELIMETER);

    return tasks.some(x => {
      const $$loc = x.createLocation();
      const has = $$loc === loc || (deep && $$loc.length > loc.length && $$loc.indexOf($loc) !== -1);

      return has;
    });
  }
}

const createRootLocation: LocationCreator = () => ROOT;

type PortEvent = 'message';
type PortListener = (value: unknown) => void;

export type RestoreOptions = {
  fiber: Fiber;
  setValue?: () => void;
  resetValue?: () => void;
};

export type ScheduleCallbackOptions = {
  priority?: TaskPriority;
  forceAsync?: boolean;
  isTransition?: boolean;
  createLocation?: () => string;
  setPendingStatus?: SetPendingStatus;
  onCompleted?: () => void;
};

const scheduler = new Scheduler();

export { scheduler };
