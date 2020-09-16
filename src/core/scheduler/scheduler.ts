import { platform } from '../global';
import { fromHookUpdateHelper } from '@core/scope';
import { Updator } from './model';


class Scheduller {
  private queue: Array<Updator> = [];

  public scheduleUpdate = (updator: Updator) => {
    this.queue.push(updator);
    platform.ric(this.executeUpdate);
  };

  private executeUpdate = (deadline: IdleDeadline) => {
    const isFrommHookUpdate = fromHookUpdateHelper.get();

    if (isFrommHookUpdate) {
      platform.ric(this.executeUpdate);
    } else {
      const [updator] = this.queue;

      if (updator) {
        updator.run(deadline);
        this.queue.shift();
        platform.ric(this.executeUpdate);
      }
    }
  }
}

const scheduller = new Scheduller();

export {
  scheduller,
};
