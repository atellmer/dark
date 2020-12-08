import { platform } from '../global';
import { nextUnitOfWorkHelper } from '../scope';
import { Task } from './model';

class Scheduler {
  private queue: Array<Task> = [];

  public run  = () => {
    platform.ric(this.executeTasks, { timeout: 16 });
  };

  public scheduleTask = (task: Task) => {
    this.queue.push(task);
  };

  private executeTasks = (deadline: IdleDeadline) => {
    const hasUnitOfWork = Boolean(nextUnitOfWorkHelper.get());
    const [asyncUpdator] = this.queue;

    if (!hasUnitOfWork && asyncUpdator) {
      this.queue.shift();
      asyncUpdator.calllback(deadline);
    }

    platform.ric(this.executeTasks, { timeout: 16 });
  };
}

const scheduler = new Scheduler();

export {
  scheduler,
};
