
type Task = {
  id?: number;
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
          //console.log('main-thread', task.id);
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
          //console.log('branch-thread', task.id);
        });
      }
    }

    requestIdleCallback(this.runBranchThread);
  };
}

const scheduler = new Scheduler();

scheduler.run();

function requestCallback(callback: (deadline: IdleDeadline, isHightPriority: boolean) => boolean) {
  scheduler.addTask({
    execute: (deadline, isHightPriority, onComplete) => {
      const run = (deadline: IdleDeadline) => {
        const shouldYeild = callback(deadline, isHightPriority);

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
    },
  });
}

const box = document.createElement('div');
const style = `
  position: absolute;
  top: 0;
  left: 0;
  width: 100px;
  height: 100px;
  background-color: blueviolet;
`;
box.setAttribute('style', style);

document.body.appendChild(box);

let shift = 0;
let q = 1;

const animateBox = (deadline: IdleDeadline) => {
  shift = shift + q;
  box.style.setProperty('transform', `translateX(${shift}px)`);

  if (shift >= window.innerWidth - (box.clientWidth)) {
    q = -1;
  }

  if (shift <= 0) {
    q = 1;
  }

  const shouldYeild = deadline ? deadline.timeRemaining() < 1 : false;

  return shouldYeild;
};


let count = 0;
let random = 0;

function doHardWork(deadline: IdleDeadline, isHightPriority: boolean) {
  let shouldYeild = false;

  while (count < 10000000 && !shouldYeild) {
    // long execution time.
    if (!isHightPriority) {
      count++;
    }
    random = Math.random();
    shouldYeild = deadline ? deadline.timeRemaining() < 1 : false;
  }

  if (!shouldYeild) {
    console.log('hard-work', count);
    count = 0;
  }

  return shouldYeild;
}

setInterval(() => {
  requestCallback(doHardWork);
}, 1000);

const update = () => {
  requestCallback(animateBox);
  requestAnimationFrame(update);
}

requestAnimationFrame(update);
