import { platform } from '../global';
import { nextUnitOfWorkHelper } from '../scope';
import { Updator, UpdatorZone } from './model';


class Scheduler {
  private syncQueue: Array<Updator> = [];
  private asyncQueue: Array<Updator> = [];

  public run  = () => platform.ric(this.executeAsyncTasks);

  public scheduleTask = (updator: Updator) => {
    if (updator.zone === UpdatorZone.ROOT) {
      this.asyncQueue.push(updator);
    } else {
      this.syncQueue.push(updator);
      this.executeSyncTasks();
    }
  };

  private executeSyncTasks = () => {
    const hasUnitOfWork = Boolean(nextUnitOfWorkHelper.get());

    if (!hasUnitOfWork) {
      for (const syncUpdator of this.syncQueue) {
        syncUpdator.run(null);
      }

      this.syncQueue = [];
    } else {
      platform.ric(this.executeSyncTasks);
    }
  };

  private executeAsyncTasks = (deadline: IdleDeadline) => {
    const hasUnitOfWork = Boolean(nextUnitOfWorkHelper.get());
    const [asyncUpdator] = this.asyncQueue;

    if (!hasUnitOfWork && asyncUpdator) {
      this.asyncQueue.shift();
      asyncUpdator.run(deadline);
    }

    platform.ric(this.executeAsyncTasks);
  };
}

const scheduler = new Scheduler();

export {
  scheduler,
};
