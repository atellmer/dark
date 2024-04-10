import { type SubscriberWithValue, detectIsFalsy, detectIsUndefined } from '@dark-engine/core';

import { normalizePath, parseURL, join } from '../utils';

const history = globalThis.history;
class RouterHistory {
  private stack: Array<string> = [];
  private cursor = -1;
  private subscribers: Set<SubscriberWithValue<string>> = new Set();
  private fromHistory = false;
  dispose: () => void = null;

  constructor(url: string) {
    if (detectIsFalsy(url)) throw new Error('[web-router]: RouterHistory must have an initial url!');
    const { pathname, search, hash } = parseURL(url);
    const $url = join(pathname, search, hash);

    this.stack.push($url);
    this.cursor = this.stack.length - 1;

    if (!detectIsUndefined(history)) {
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
    return normalizePath(this.stack[this.cursor]);
  };

  private getState(): State {
    return (history.state && history.state[STATE_KEY]) || null;
  }

  private createStateBox(): StateBox {
    const state = history.state || {};

    return { ...state, [STATE_KEY]: { cursor: this.cursor, stack: this.stack } };
  }

  private syncHistory(action: HistoryAction, url: string) {
    if (!history) return;
    const box = this.createStateBox();
    const $url = normalizePath(url);

    switch (action) {
      case HistoryAction.PUSH:
        return history.pushState(box, '', $url);
      case HistoryAction.REPLACE:
        return history.replaceState(box, '', $url);
    }
  }

  subscribe = (subscriber: SubscriberWithValue<string>) => {
    this.subscribers.add(subscriber);

    return () => this.subscribers.delete(subscriber);
  };

  push(url: string) {
    this.stack.splice(this.cursor + 1, this.stack.length, url);
    this.cursor = this.stack.length - 1;
    this.syncHistory(HistoryAction.PUSH, url);
    this.mapSubscribers();
  }

  replace(url: string) {
    this.stack[this.stack.length - 1] = url;
    this.syncHistory(HistoryAction.REPLACE, url);
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
