import { detectIsFalsy } from '@dark-engine/core';

class RouterHistory {
  private stack: Array<string> = [];
  private cursor = -1;
  private subscribers: Set<(value: string) => void> = new Set();

  constructor(url: string) {
    if (detectIsFalsy(url)) {
      throw new Error('[web-router]: RouterHistory must have initial url!');
    }

    this.stack.push(url);
    this.cursor++;
  }

  private mapSubscribers() {
    for (const subscriber of this.subscribers) {
      subscriber(this.getValue());
    }
  }

  private getValue = () => {
    return this.stack[this.cursor] || '';
  };

  public subscribe = (subscriber: (value: string) => void) => {
    this.subscribers.add(subscriber);

    return () => this.subscribers.delete(subscriber);
  };

  public push(value: string) {
    this.stack.splice(this.cursor + 1, this.stack.length, value);
    this.cursor = this.stack.length - 1;
    console.log('push', this.cursor, this.stack);
    this.mapSubscribers();
  }

  public replace(value: string) {
    this.stack[this.stack.length - 1] = value;
    console.log('replace', this.cursor, this.stack);
    this.mapSubscribers();
  }

  public forward() {
    this.cursor < this.stack.length - 1 && this.cursor++;
    console.log('forward', this.cursor, this.stack);
    this.mapSubscribers();
  }

  public back() {
    this.cursor > 0 && this.cursor--;
    console.log('back', this.cursor, this.stack);
    this.mapSubscribers();
  }

  public go(delta: number) {
    this.cursor += delta;

    if (this.cursor > this.stack.length - 1) {
      this.cursor = this.stack.length - 1;
    }

    if (this.cursor < 0) {
      this.cursor = 0;
    }

    console.log('go', this.cursor, this.stack);
    this.mapSubscribers();
  }
}

const createRouterHistory = (url: string) => new RouterHistory(url);

export { createRouterHistory };
