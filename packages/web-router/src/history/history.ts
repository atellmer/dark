import { type SubscriberWithValue, detectIsFalsy, detectIsUndefined, EventEmitter } from '@dark-engine/core';

import { normalizePath, parseURL, join, illegal } from '../utils';

const history = globalThis.history;
class RouterHistory {
  private stack: Array<string> = [];
  private cursor = -1;
  private emitter = new EventEmitter<HistoryEvent, string>();
  private fromHistory = false;
  dispose: () => void = null;

  constructor(url: string) {
    if (detectIsFalsy(url)) illegal('The RouterHistory must have an initial url!');
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
          if (this.stack.length < state.stack.length) {
            this.emitter.emit('forward', this.getValue());
          } else if (this.stack.length > state.stack.length) {
            this.emitter.emit('back', this.getValue());
          }

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
        this.emitter = new EventEmitter();
        this.stack = [];
        this.cursor = -1;
      };
    }
  }

  private mapSubscribers() {
    this.emitter.emit('change', this.getValue());
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

  subscribe = (event: HistoryEvent, subscriber: SubscriberWithValue<string>) => {
    return this.emitter.on(event, subscriber);
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

type HistoryEvent = 'change' | 'forward' | 'back';

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
