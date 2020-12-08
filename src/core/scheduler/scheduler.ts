import { platform } from '../global';
import { workLoop } from '../fiber';
import { nextUnitOfWorkHelper } from '../scope';
import { Task } from './model';

class Scheduler {
  private queue: Array<Task> = [];

  public scheduleTask = (task: Task) => {
    this.queue.push(task);
    this.executeTasks();
  };

  public executeTasks = () => {
    const hasUnitOfWork = Boolean(nextUnitOfWorkHelper.get());
    const [task] = this.queue;

    if (!hasUnitOfWork && task) {
      this.queue.shift();
      task.calllback();
      platform.requestCallback(workLoop);
    }
  };
}

const scheduler = new Scheduler();

export {
  scheduler,
};
