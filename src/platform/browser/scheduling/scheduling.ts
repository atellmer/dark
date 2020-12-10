import { scheduler } from '@core/scheduler';
import { getTime } from '@helpers';


type Callback = () => boolean;

const yeildInterval = 5;
let scheduledCallback: Callback = null;
let deadline = 0;
let isMessageLoopRunning = false;

const shouldYeildToHost = () => getTime() >= deadline;

function performWorkUntilDeadline() {
  if (scheduledCallback) {
    deadline = getTime() + yeildInterval;

    try {
      const hasMoreWork = scheduledCallback();

      if (!hasMoreWork) {
        isMessageLoopRunning = false;
        scheduledCallback = null;
        scheduler.executeTasks();
      } else {
        port.postMessage(null);
      }
    } catch (error) {
      port.postMessage(null);
      throw error;
    }

  } else {
    isMessageLoopRunning = false;
  }
}

function requestCallback(callback: Callback) {
  if (process.env.NODE_ENV === 'test') {
    return requestCallbackSync(callback);
  }

  scheduledCallback = callback;

  if (!isMessageLoopRunning) {
    isMessageLoopRunning = true;
    port.postMessage(null);
  }
}

function requestCallbackSync(callback: Callback) {
  while (callback()) {}
  scheduler.executeTasks();
}

let channel: MessageChannel = null;
let port: MessagePort = null;

function setup() {
  if (process.env.NODE_ENV === 'test') {
    return;
  }

  channel = new MessageChannel();
  port = channel.port2;

  channel.port1.onmessage = performWorkUntilDeadline;
}

setup();

export {
  shouldYeildToHost,
  requestCallback,
};
