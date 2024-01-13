import { detectIsFalsy, type SubscriberWithValue } from '@dark-engine/core';

import { normalaizePathname, parseURL } from '../utils';

const history = globalThis.history;
class RouterHistory {
  private stack: Array<string> = [];
  private cursor = -1;
  private subscribers: Set<SubscriberWithValue<string>> = new Set();
  private fromHistory = false;
  dispose: () => void = null;

  constructor(url: string) {
    if (detectIsFalsy(url)) {
      throw new Error('[web-router]: RouterHistory must have initial url!');
    }

    const { pathname, search } = parseURL(url);
    const spathname = pathname + search;

    this.stack.push(spathname);
    this.cursor = this.stack.length - 1;

    if (history) {
      const state = this.getState();

      if (!state) {
        history.replaceState(this.createStateBox(), '');
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
    return normalaizePathname(this.stack[this.cursor]);
  };

  private getState(): State {
    return (history.state && history.state[STATE_KEY]) || null;
  }

  private createStateBox(): StateBox {
    const state = history.state || {};

    return { ...state, [STATE_KEY]: { cursor: this.cursor, stack: this.stack } };
  }

  private syncHistory(action: HistoryAction, spathname: string) {
    if (!history) return;
    const stateBox = this.createStateBox();
    const $spathname = normalaizePathname(spathname);

    switch (action) {
      case HistoryAction.PUSH:
        return history.pushState(stateBox, '', $spathname);
      case HistoryAction.REPLACE:
        return history.replaceState(stateBox, '', $spathname);
    }
  }

  subscribe = (subscriber: SubscriberWithValue<string>) => {
    this.subscribers.add(subscriber);

    return () => this.subscribers.delete(subscriber);
  };

  push(spathname: string) {
    this.stack.splice(this.cursor + 1, this.stack.length, spathname);
    this.cursor = this.stack.length - 1;
    this.syncHistory(HistoryAction.PUSH, spathname);
    this.mapSubscribers();
  }

  replace(spathname: string) {
    this.stack[this.stack.length - 1] = spathname;
    this.syncHistory(HistoryAction.REPLACE, spathname);
    this.mapSubscribers();
  }

  forward() {
    this.go(1);
  }

  back() {
    this.go(-1);
  }

  go(delta: number) {
    const max = this.stack.length - 1;
    let $delta = delta;

    this.fromHistory = true;
    this.cursor += delta;

    if (this.cursor > max) {
      this.cursor = max;
      $delta = max;
    } else if (this.cursor < 0) {
      this.cursor = 0;
      $delta = -max;
    }

    history?.go($delta);
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
