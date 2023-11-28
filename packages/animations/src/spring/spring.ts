import { type Atom, type SubscriberWithValue, atom } from '@dark-engine/core';

import { type SpringValue } from '../shared';

class Spring<T extends string = string> {
  private props: Record<T, Atom<number>> = {} as Record<T, Atom<number>>;
  private subscribers = new Set<SubscriberWithValue<SpringValue<T>>>();

  prop(key: T) {
    return this.props[key] || null;
  }

  setProp(key: T, value: number) {
    !this.props[key] && (this.props[key] = atom(value));
    this.props[key].set(value);
  }

  value(): SpringValue<T> {
    const value = Object.keys(this.props).reduce((acc, x) => ((acc[x] = this.props[x].get()), acc), {});

    return value as SpringValue<T>;
  }

  on(fn: SubscriberWithValue<SpringValue<T>>) {
    this.subscribers.add(fn);

    return () => this.subscribers.delete(fn);
  }

  notify() {
    this.subscribers.forEach(x => x(this.value()));
  }
}

export { Spring };
