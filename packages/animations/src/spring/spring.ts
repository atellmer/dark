import { type Atom, type Callback, type SubscriberWithValue, atom } from '@dark-engine/core';

import { type SpringValue } from '../shared';

class Spring<T extends string = string> {
  private props: Record<T, Atom<number>> = {} as Record<T, Atom<number>>;

  getProp(key: T) {
    return this.props[key] ? this.props[key].get() : null;
  }

  setProp(key: T, value: number) {
    !this.props[key] && (this.props[key] = atom(value));
    this.props[key].set(value);
  }

  toValue(): SpringValue<T> {
    const value = Object.keys(this.props).reduce((acc, x) => ((acc[x] = this.props[x].get()), acc), {});

    return value as SpringValue<T>;
  }

  on(fn: SubscriberWithValue<SpringValue<T>>) {
    const offs: Array<Callback> = [];

    for (const key of this.getKeys()) {
      const off = this.props[key].on(() => fn(this.toValue()));

      offs.push(off);
    }

    return () => offs.forEach(x => x());
  }

  private getKeys() {
    return Object.keys(this.props) as Array<T>;
  }
}

export { Spring };
