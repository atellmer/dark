
type Task = {
  id?: number;
  marker?: string;
  execute: (deadline: IdleDeadline, isHightPriority: boolean, onComplete: () => void) => void;
};

class Scheduler {
  private nextId = 0;
  private mainTaskId = 1;
  private branchTaskId = 1;
  private taskMap: Map<number, Task> = new Map();
  private isMainThreadBusy = false;
  private isBranchThreadBusy = false;

  public run = () => {
    requestIdleCallback((deadline: IdleDeadline) => {
      this.runMainThread(deadline);
      this.runBranchThread(deadline);
    });
  };

  public addTask = (task: Task) => {
    const id = ++this.nextId;

    this.taskMap.set(id, { ...task, id });
  };

  public runMainThread = (deadline: IdleDeadline) => {

    if (!this.isMainThreadBusy) {
      const task = this.taskMap.get(this.mainTaskId);

      if (task) {
        this.isMainThreadBusy = true;
        this.taskMap.delete(this.mainTaskId);

        if (this.branchTaskId <= this.mainTaskId) {
          this.branchTaskId = this.mainTaskId + 1;
        }

        task.execute(deadline, false, () => {
          this.isMainThreadBusy = false;
          this.mainTaskId++;
          console.log('main-thread', task.id, task.marker);
        });
      }
    }

    requestIdleCallback(this.runMainThread);
  };

  public runBranchThread = (deadline: IdleDeadline) => {

    if (!this.isBranchThreadBusy && this.isMainThreadBusy) {
      const task = this.branchTaskId > this.mainTaskId
        ? this.taskMap.get(this.branchTaskId)
        : null;

      if (task) {
        this.isBranchThreadBusy = true;
        task.execute(deadline, true, () => {
          this.isBranchThreadBusy = false;
          this.branchTaskId++;
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
  const startTime = performance.now() + 500;
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

// const update = () => {
//   scheduler.addTask({
//     marker: 'animation',
//     execute: workLoop,
//   });

//   requestAnimationFrame(update);
// }

// requestAnimationFrame(update);

// const timerId = setInterval(() => {
//   scheduler.addTask({
//     marker: 'animation',
//     execute: workLoop,
//   })
// }, 100);
