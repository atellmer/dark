import { platform } from '../global';
import { nextUnitOfWorkHelper } from '@core/scope';
import { Updator, UpdatorZone } from './model';


class Scheduler {
  private queue: Array<Updator> = [];

  public scheduleUpdate = (updator: Updator) => {
    this.queue.push(updator);
    platform.ric(this.executeUpdate);
  };

  private executeUpdate = (deadline: IdleDeadline) => {
    const hasUnitOfWork = Boolean(nextUnitOfWorkHelper.get());

    if (hasUnitOfWork) {
      platform.ric(this.executeUpdate);
    } else if (this.queue.length > 0) {
      const [updator] = this.queue;

      this.queue.shift();
      updator.run(deadline);
      platform.ric(this.executeUpdate);
    }
  }
}

const scheduler = new Scheduler();

export {
  scheduler,
};
