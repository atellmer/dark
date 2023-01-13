import { Frame, Page, NavigatedData } from '@nativescript/core';
import { type SubscriberWithValue } from '@dark-engine/core';

import { normalizePathname } from './utils';
import { SLASH } from '../constants';

class NavigationHistory {
  private stack: Array<string> = [];
  private cursor = -1;
  private subscribers: Set<SubscriberWithValue<string>> = new Set();
  private frame: Frame;
  private page: Page;
  public dispose: () => void = null;

  constructor(frame: Frame, page: Page) {
    this.stack.push(SLASH);
    this.cursor = this.stack.length - 1;
    this.frame = frame;
    this.page = page;

    const handleBack = (e: NavigatedData) => {
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

  private mapSubscribers() {
    for (const subscriber of this.subscribers) {
      subscriber(this.getValue());
    }
  }

  private getValue = () => {
    return normalizePathname(this.stack[this.cursor]);
  };

  private syncHistory(action: HistoryAction) {
    switch (action) {
      case HistoryAction.PUSH:
        return this.frame.navigate({
          create: () => this.page,
          animated: false,
        });
      case HistoryAction.BACK:
        return this.frame.goBack();
    }
  }

  public subscribe = (subscriber: SubscriberWithValue<string>) => {
    this.subscribers.add(subscriber);

    return () => this.subscribers.delete(subscriber);
  };

  public push(pathname: string) {
    this.stack.splice(this.cursor + 1, this.stack.length, pathname);
    this.cursor = this.stack.length - 1;
    this.syncHistory(HistoryAction.PUSH);
    this.mapSubscribers();
  }

  public back(sync = true) {
    this.cursor -= 1;

    if (this.cursor < 0) {
      this.cursor = 0;
    }

    sync && this.syncHistory(HistoryAction.BACK);
    this.mapSubscribers();
  }
}

enum HistoryAction {
  PUSH = 'PUSH',
  BACK = 'BACK',
}

const NAVIGATED_FROM_EVENT = 'navigatedFrom';

const createNavigationHistory = (frame: Frame, page: Page) => new NavigationHistory(frame, page);

export { NavigationHistory, createNavigationHistory };
