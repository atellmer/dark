import { detectIsFalsy, type SubscriberWithValue } from '@dark-engine/core';
import { normalaizeEnd } from '../utils';

const browserHistory = globalThis.history;
class RouterHistory {
  private stack: Array<string> = [];
  private cursor = -1;
  private subscribers: Set<(value: string) => void> = new Set();
  private fromHistory = false;
  public dispose: () => void = null;

  constructor(url: string) {
    if (detectIsFalsy(url)) {
      throw new Error('[web-router]: RouterHistory must have initial url!');
    }

    this.stack.push(url);
    this.cursor = this.stack.length - 1;

    if (browserHistory) {
      const state = this.getState();

      if (!state) {
        browserHistory.replaceState(this.createStateBox(), '');
      } else {
        this.stack = state.stack;
        this.cursor = state.cursor;
      }

      const handleEvent = () => {
        const state = this.getState();

        if (state) {
          this.stack = state.stack;
          this.cursor = state.cursor;
        }

        if (!this.fromHistory) {
          this.mapSubscribers();
        }

        this.fromHistory = false;
      };

      window.addEventListener('popstate', handleEvent);

      this.dispose = () => {
        window.removeEventListener('popstate', handleEvent);
        this.subscribers.clear();
        this.stack = [];
        this.cursor = -1;
      };
    }
  }

  private mapSubscribers() {
    for (const subscriber of this.subscribers) {
      subscriber(this.getValue());
    }
  }

  private getValue = () => {
    return normalaizeEnd(this.stack[this.cursor]);
  };

  private getState(): State {
    return (browserHistory.state && browserHistory.state[STATE_KEY]) || null;
  }

  private createStateBox(): StateBox {
    const state = browserHistory.state || {};

    return { ...state, [STATE_KEY]: { cursor: this.cursor, stack: this.stack } };
  }

  private syncHistory(action: HistoryAction, value: string) {
    if (!browserHistory) return;
    const stateBox = this.createStateBox();
    const normalValue = normalaizeEnd(value);

    switch (action) {
      case HistoryAction.PUSH:
        return browserHistory.pushState(stateBox, '', normalValue);
      case HistoryAction.REPLACE:
        return browserHistory.replaceState(stateBox, '', normalValue);
    }
  }

  public subscribe = (subscriber: SubscriberWithValue<string>) => {
    this.subscribers.add(subscriber);

    return () => this.subscribers.delete(subscriber);
  };

  public push(value: string) {
    this.stack.splice(this.cursor + 1, this.stack.length, value);
    this.cursor = this.stack.length - 1;
    this.syncHistory(HistoryAction.PUSH, value);
    this.mapSubscribers();
  }

  public replace(value: string) {
    this.stack[this.stack.length - 1] = value;
    this.syncHistory(HistoryAction.REPLACE, value);
    this.mapSubscribers();
  }

  public forward() {
    this.go(1);
  }

  public back() {
    this.go(-1);
  }

  public go(delta: number) {
    this.fromHistory = true;
    this.cursor += delta;

    if (this.cursor > this.stack.length - 1) {
      this.cursor = this.stack.length - 1;
    } else if (this.cursor < 0) {
      this.cursor = 0;
    }

    browserHistory?.go(delta);
    this.mapSubscribers();
  }
}

enum HistoryAction {
  PUSH = 'PUSH',
  REPLACE = 'REPLACE',
}

type StateBox = {
  [STATE_KEY]: State;
};

type State = {
  cursor: number;
  stack: Array<string>;
};

const STATE_KEY = 'web-router';

const createRouterHistory = (url: string) => new RouterHistory(url);

export { RouterHistory, createRouterHistory };
