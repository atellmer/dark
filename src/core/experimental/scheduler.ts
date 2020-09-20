type Task = {
  id?: number;
  marker?: string;
  branchThread?: boolean;
  execute: (deadline: IdleDeadline, isHightPriority: boolean, onComplete: () => void) => void;
};

class Scheduler {
  private nextId = 0;
  private queue: Array<Task> = [];
  private isMainThreadBusy = false;
  private isBranchThreadBusy = false;

  public run = () => {
    requestIdleCallback(this.runMainThread);
    requestIdleCallback(this.runBranchThread);
  };

  public addTask = (task: Task) => {
    this.queue.push({
      ...task,
      id: ++this.nextId,
      branchThread: false,
    });
  };

  public runMainThread = (deadline: IdleDeadline) => {
    const [task] = this.queue;

    if (task) {
      if (!this.isMainThreadBusy) {
        this.isMainThreadBusy = true;
        this.queue.shift();
        task.execute(deadline, false, () => {
          this.isMainThreadBusy = false;
          console.log('main-thread', task.id, task.marker);
        });
      }
    }

    requestIdleCallback(this.runMainThread);
  };

  public runBranchThread = (deadline: IdleDeadline) => {

    if (this.queue.length > 0 && this.isMainThreadBusy && !this.isBranchThreadBusy) {
      const task = this.queue.find(x => x.branchThread === false);

      if (task) {
        this.isBranchThreadBusy = true;
        task.execute(deadline, true, () => {
          this.isBranchThreadBusy = false;
          task.branchThread = true;
          console.log('branch-thread', task.id, task.marker);
        });
      }
    }

    requestIdleCallback(this.runBranchThread);
  };
}

const scheduler = new Scheduler();

scheduler.run();

const workLoop = (deadline, isHightPriority, onComplete) => {
  const startTime = performance.now() + 2000;
  const run = (deadline: IdleDeadline) => {
    let shouldYeild = false;
    while (performance.now() < startTime && !shouldYeild) {
      // long execution time.
      shouldYeild = deadline ? deadline.timeRemaining() < 1 : false;
    }

    if (!shouldYeild) {
      onComplete();
    } else {
      if (isHightPriority) {
        onComplete();
      } else {
        requestIdleCallback(run);
      }
    }
  }

  run(deadline);
};

setInterval(() => {
  scheduler.addTask({
    marker: 'timer',
    execute: workLoop,
  })
}, 1000);

// const timerId = setInterval(() => {
//   scheduler.addTask({
//     marker: 'animation',
//     execute: workLoop,
//   })
// }, 200);
