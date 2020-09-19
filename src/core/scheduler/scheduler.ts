import { platform } from '../global';
import { nextUnitOfWorkHelper } from '../scope';
import { Updator, UpdatorZone } from './model';
import { getTime } from '@helpers';


const MAX_BATCHING_TIME = 100;

class Scheduler {
  private syncQueue: Array<Updator> = [];
  private asyncQueue: Array<Updator> = [];

  public run  = () => {
    this.executeSyncTasks();
    platform.ric(this.executeAsyncTasks);
  };

  public scheduleTask = (updator: Updator) => {
    if (updator.zone === UpdatorZone.ROOT) {
      this.asyncQueue.push(updator);
    } else {
      this.syncQueue.push(updator);
    }
  };

  private executeSyncTasks = () => {
    const hasUnitOfWork = Boolean(nextUnitOfWorkHelper.get());

    if (!hasUnitOfWork) {
      const startTime = getTime();
      let shouldYield = false;
      let idx = 0;

      for (const syncUpdator of this.syncQueue) {
        idx++;
        syncUpdator.run(null);
        shouldYield = getTime() - startTime > MAX_BATCHING_TIME;

        if (shouldYield) {
          break;
        }
      }

      this.syncQueue.splice(0, idx);
    }

    platform.ric(this.executeSyncTasks);
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
