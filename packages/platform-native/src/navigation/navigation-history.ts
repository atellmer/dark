import { Frame, Page, NavigatedData } from '@nativescript/core';

import { normalizePathname } from './utils';
import { SLASH } from './constants';
import { type NavigationOptions } from './navigation-container';

class NavigationHistory {
  private stack: Array<string> = [];
  private cursor = -1;
  private subscribers: Set<HistorySubscriber> = new Set();
  private frame: Frame;
  private page: Page;
  private fromUserEvent = false;
  public dispose: () => void = null;

  constructor(frame: Frame, page: Page) {
    this.stack.push(SLASH);
    this.cursor = this.stack.length - 1;
    this.frame = frame;
    this.page = page;

    const handleBack = (e: NavigatedData) => {
      if (this.fromUserEvent) {
        this.fromUserEvent = false;
        return;
      }
      e.isBackNavigation && this.back(false);
    };

    this.dispose = () => {
      this.page.off(NAVIGATED_FROM_EVENT, handleBack);
      this.subscribers.clear();
      this.stack = [];
      this.cursor = -1;
    };
    this.page.on(NAVIGATED_FROM_EVENT, handleBack);
  }

  private mapSubscribers(action: HistoryAction, options?: NavigationOptions) {
    for (const subscriber of this.subscribers) {
      subscriber(this.getValue(), action, options);
    }
  }

  private getValue = () => {
    return this.stack[this.cursor];
  };

  private syncHistory(action: HistoryAction) {
    switch (action) {
      case HistoryAction.PUSH:
        return this.frame.navigate({
          create: () => this.page,
          animated: false,
        });
      case HistoryAction.REPLACE:
        return null;
      case HistoryAction.BACK:
        return this.frame.goBack();
    }
  }

  public getBack = () => {
    return this.stack[this.cursor - 1] || this.getValue();
  };

  public subscribe = (subscriber: HistorySubscriber) => {
    this.subscribers.add(subscriber);

    return () => this.subscribers.delete(subscriber);
  };

  public push(pathname: string, options?: NavigationOptions) {
    const action = HistoryAction.PUSH;
    const normalPathname = normalizePathname(pathname);

    if (normalPathname === this.stack[this.cursor]) return;

    this.stack.splice(this.cursor + 1, this.stack.length, normalPathname);
    this.cursor = this.stack.length - 1;
    this.syncHistory(action);
    this.mapSubscribers(action, options);
  }

  public replace(pathname: string) {
    const action = HistoryAction.REPLACE;
    const normalPathname = normalizePathname(pathname);

    this.stack[this.cursor] = normalPathname;
    this.cursor = this.stack.length - 1;
    this.syncHistory(action);
    this.mapSubscribers(action);
  }

  public back(sync = true) {
    if (this.cursor === 0) return;

    const action = HistoryAction.BACK;

    this.stack.pop();
    this.fromUserEvent = sync;
    this.cursor -= 1;

    if (this.cursor < 0) {
      this.cursor = 0;
    }

    sync && this.syncHistory(action);
    this.mapSubscribers(action);
  }
}

export type HistorySubscriber = (pathname: string, action: HistoryAction, options?: NavigationOptions) => void;

export enum HistoryAction {
  PUSH = 'PUSH',
  REPLACE = 'REPLACE',
  BACK = 'BACK',
}

const NAVIGATED_FROM_EVENT = 'navigatedFrom';

const createNavigationHistory = (frame: Frame, page: Page) => new NavigationHistory(frame, page);

export { NavigationHistory, createNavigationHistory };
